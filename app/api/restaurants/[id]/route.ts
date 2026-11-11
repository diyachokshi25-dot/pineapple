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
    createdAt: (row.created_at as Date).toISOString(),
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params;
  const id = Number(rawId);

  if (!Number.isInteger(id)) {
    return Response.json({ error: "Restaurant id must be a number." }, { status: 400 });
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
    "SELECT COUNT(*)::int AS total, AVG(rating) AS average FROM reviews WHERE restaurant_id = $1",
    [id]
  );
  const totalReviews = stats[0].total as number;
  const average = stats[0].average as number | null; // AVG returns NULL when there are no rows

  // Newer version of this driver returns NUMERIC averages as strings — normalise.
  const averageNumber = average === null ? null : Number(average);
  const averageRating =
    averageNumber === null ? null : Math.round(averageNumber * 10) / 10;

  const latestRows: Row[] = await sql.query(
    "SELECT id, rating, comment, created_at FROM reviews WHERE restaurant_id = $1 ORDER BY created_at DESC, id DESC LIMIT 1",
    [id]
  );
  const olderRows: Row[] = await sql.query(
    "SELECT id, rating, comment, created_at FROM reviews WHERE restaurant_id = $1 ORDER BY created_at DESC, id DESC OFFSET 1",
    [id]
  );

  return Response.json({
    name: restaurant.name,
    cuisine: restaurant.cuisine,
    area: restaurant.area,
    averageRating,
    totalReviews,
    latestReview: latestRows.length > 0 ? toReview(latestRows[0]) : null,
    reviews: olderRows.map(toReview),
  });
}
