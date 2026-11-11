// GET /api/restaurants/[id] — everything the restaurant page needs, in one call.
// The response is shaped like the screen:
//   name/cuisine/area (banner) -> averageRating (big window) ->
//   latestReview (highlighted) -> reviews (the rest, newest first).
// Nothing here is stored. averageRating is AVG(rating) computed right now,
// totalReviews is COUNT(*) computed right now, latestReview is the newest row
// right now. The database keeps facts; this endpoint computes answers.
import { sql, type Row } from "@/lib/db";

function toReview(row: Row) {
  return {
    id: row.id,
    rating: row.rating,
    comment: row.comment,
    username: row.username ?? null,
    createdAt: (row.created_at as Date).toISOString(),
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params;
  const id = Number(rawId);

  if (!Number.isInteger(id)) {
    return Response.json({ error: "Restaurant id must be a number." }, { status: 400 });
  }

  // Optional ?stars=N — "only show me the N-star reviews".
  // Filtering is the backend's job; the frontend just asks and prints.
  const starsParam = new URL(request.url).searchParams.get("stars");
  const stars =
    starsParam !== null && starsParam !== "" ? Number(starsParam) : null;
  if (stars !== null && (!Number.isInteger(stars) || stars < 1 || stars > 5)) {
    return Response.json(
      { error: "stars must be a whole number between 1 and 5." },
      { status: 400 }
    );
  }

  const found: Row[] = await sql.query(
    "SELECT id, name, cuisine, area FROM restaurants WHERE id = $1",
    [id]
  );
  if (found.length === 0) {
    return Response.json({ error: "Restaurant not found." }, { status: 404 });
  }
  const restaurant = found[0];

  // THE core lesson, in raw SQL: facts go in, answers come out — computed now.
  const stats: Row[] = await sql.query(
    "SELECT COUNT(*)::int AS total, AVG(rating) AS average FROM reviews WHERE restaurant_id = $1 AND menu_item_id IS NULL",
    [id]
  );
  const totalReviews = stats[0].total as number;
  const average = stats[0].average as number | null; // AVG returns NULL when there are no rows

  // Menu items, each with its own computed average — again, nothing stored.
  const itemRows: Row[] = await sql.query(
    `SELECT m.id, m.name, m.description, m.price,
            COUNT(r.id)::int AS total,
            AVG(r.rating) AS average
       FROM menu_items m
       LEFT JOIN reviews r ON r.menu_item_id = m.id
      WHERE m.restaurant_id = $1
      GROUP BY m.id
      ORDER BY m.id`,
    [id]
  );
  const menuItems = itemRows.map((row) => {
    const raw = row.average === null ? null : Number(row.average);
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      price: row.price,
      averageRating: raw === null ? null : Math.round(raw * 10) / 10,
      totalReviews: row.total,
    };
  });

  // Newer version of this driver returns NUMERIC averages as strings — normalise.
  const averageNumber = average === null ? null : Number(average);
  const averageRating =
    averageNumber === null ? null : Math.round(averageNumber * 10) / 10;

  // Per-star counts (for the Amazon-style filter chips) — computed, never stored.
  const countRows: Row[] = await sql.query(
    "SELECT rating, COUNT(*)::int AS n FROM reviews WHERE restaurant_id = $1 AND menu_item_id IS NULL GROUP BY rating",
    [id]
  );
  const ratingCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const row of countRows) {
    ratingCounts[row.rating as number] = row.n as number;
  }

  const latestRows: Row[] = await sql.query(
    "SELECT id, rating, comment, username, created_at FROM reviews WHERE restaurant_id = $1 AND menu_item_id IS NULL ORDER BY created_at DESC, id DESC LIMIT 1",
    [id]
  );
  const olderRows: Row[] = await sql.query(
    `SELECT id, rating, comment, username, created_at FROM reviews
      WHERE restaurant_id = $1 AND menu_item_id IS NULL
        ${stars !== null ? "AND rating = $2" : ""}
      ORDER BY created_at DESC, id DESC
      OFFSET ${stars !== null ? "0" : "1"}`,
    stars !== null ? [id, stars] : [id]
  );

  return Response.json({
    name: restaurant.name,
    cuisine: restaurant.cuisine,
    area: restaurant.area,
    averageRating,
    totalReviews,
    ratingCounts,
    starsFilter: stars,
    latestReview: latestRows.length > 0 ? toReview(latestRows[0]) : null,
    reviews: olderRows.map(toReview),
    menuItems,
  });
}
