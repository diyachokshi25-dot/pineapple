// POST /api/reviews — save one review.
// The backend does not trust the frontend. The star picker only shows 1-5,
// but anyone with a terminal can send {"rating": 500} straight at this API,
// so we validate here, in this order:
//   1. rating is an integer from 1 to 5
//   2. comment is a non-empty string (after trimming)
//   3. restaurantId refers to a restaurant that exists (database lookup)
import { sql, type Row } from "@/lib/db";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const { restaurantId, rating, comment, menuItemId: menuItem } = (body ?? {}) as {
    restaurantId?: unknown;
    rating?: unknown;
    comment?: unknown;
    menuItemId?: unknown;
  };

  // Check 1 — rating
  if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return Response.json(
      { error: "Rating must be a whole number between 1 and 5." },
      { status: 400 }
    );
  }

  // Check 2 — comment
  if (typeof comment !== "string" || comment.trim().length === 0) {
    return Response.json({ error: "Comment cannot be empty." }, { status: 400 });
  }

  // Check 3 — restaurant must actually exist (a database lookup)
  if (typeof restaurantId !== "number" || !Number.isInteger(restaurantId)) {
    return Response.json({ error: "restaurantId must be a whole number." }, { status: 400 });
  }
  const found: Row[] = await sql.query("SELECT id FROM restaurants WHERE id = $1", [
    restaurantId,
  ]);
  if (found.length === 0) {
    return Response.json(
      { error: `Restaurant ${restaurantId} does not exist.` },
      { status: 400 }
    );
  }

  // Optional: a review can be about one menu item instead of the whole place.
  // Same rule applies — if an item is named, it must actually exist on that menu.
  const menuItemId =
    menuItem === null || menuItem === undefined ? null : menuItem;
  if (menuItemId !== null) {
    if (typeof menuItemId !== "number" || !Number.isInteger(menuItemId)) {
      return Response.json({ error: "menuItemId must be a whole number." }, { status: 400 });
    }
    const item: Row[] = await sql.query(
      "SELECT id FROM menu_items WHERE id = $1 AND restaurant_id = $2",
      [menuItemId, restaurantId]
    );
    if (item.length === 0) {
      return Response.json(
        { error: `Menu item ${menuItemId} does not exist on restaurant ${restaurantId}.` },
        { status: 400 }
      );
    }
  }

  // All checks passed — write exactly one row of FACTS. Nothing else changes.
  const inserted: Row[] = await sql.query(
    "INSERT INTO reviews (restaurant_id, menu_item_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING id",
    [restaurantId, menuItemId, rating, comment.trim()]
  );

  return Response.json({ success: true, reviewId: inserted[0].id }, { status: 201 });
}
