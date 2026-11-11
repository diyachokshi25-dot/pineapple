// GET /api/restaurants — the homepage's data, shaped like the screen:
// every restaurant with its banner facts plus the two computed answers
// (averageRating via AVG, totalReviews via COUNT). Computed now, stored never.
import { sql, type Row } from "@/lib/db";

export async function GET() {
  const rows: Row[] = await sql.query(
    `SELECT r.id, r.name, r.cuisine, r.area,
            COUNT(rv.id)::int AS total,
            AVG(rv.rating) AS average
       FROM restaurants r
       LEFT JOIN reviews rv ON rv.restaurant_id = r.id AND rv.menu_item_id IS NULL
      GROUP BY r.id
      ORDER BY r.id`
  );

  const restaurants = rows.map((row) => {
    const raw = row.average === null ? null : Number(row.average);
    return {
      id: row.id,
      name: row.name,
      cuisine: row.cuisine,
      area: row.area,
      averageRating: raw === null ? null : Math.round(raw * 10) / 10,
      totalReviews: row.total,
    };
  });

  return Response.json({ restaurants });
}
