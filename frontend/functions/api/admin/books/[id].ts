type Env = { DB: D1Database };
const toBook = (row: Record<string, unknown>) => ({ ...row, available: Boolean(row.available), imageUrl: row.image_url, igUrl: row.ig_url });

export const onRequestPut: PagesFunction<Env> = async ({ request, env, params }) => {
  const body = await request.json() as Record<string, unknown>;
  const result = await env.DB.prepare('UPDATE books SET title=?, category=?, price=?, available=?, image_url=?, ig_url=?, updated_at=CURRENT_TIMESTAMP WHERE id=? RETURNING *')
    .bind(body.title, body.category, body.price, body.available ? 1 : 0, body.imageUrl ?? '', body.igUrl ?? '', params.id).first();
  if (!result) return Response.json({ error: 'ไม่พบหนังสือ' }, { status: 404 });
  return Response.json(toBook(result as Record<string, unknown>));
};

export const onRequestDelete: PagesFunction<Env> = async ({ env, params }) => {
  await env.DB.prepare('DELETE FROM books WHERE id = ?').bind(params.id).run();
  return new Response(null, { status: 204 });
};
