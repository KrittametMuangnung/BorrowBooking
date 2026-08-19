type Env = { DB: D1Database };
const toBook = (row: Record<string, unknown>) => ({ ...row, available: Boolean(row.available), imageUrl: row.image_url, igUrl: row.ig_url });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const body = await request.json() as Record<string, unknown>;
  const result = await env.DB.prepare('INSERT INTO books (title, category, price, available, image_url, ig_url) VALUES (?, ?, ?, ?, ?, ?) RETURNING *')
    .bind(body.title, body.category ?? 'novel', body.price ?? 0, body.available ? 1 : 0, body.imageUrl ?? '', body.igUrl ?? '').first();
  return Response.json(toBook(result as Record<string, unknown>), { status: 201 });
};
