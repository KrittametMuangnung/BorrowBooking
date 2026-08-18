type Env = { DB: D1Database };

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  if (request.method === 'GET') {
    const available = url.searchParams.get('available');
    const query = available === null ? 'SELECT * FROM books ORDER BY id DESC' : 'SELECT * FROM books WHERE available = ? ORDER BY id DESC';
    const result = await env.DB.prepare(query).bind(...(available === null ? [] : [available === 'true' ? 1 : 0])).all();
    return Response.json(result.results);
  }
  if (!url.pathname.startsWith('/api/admin/')) return new Response('Not found', { status: 404 });
  const id = url.pathname.split('/').pop();
  if (request.method === 'POST') {
    const body = await request.json() as Record<string, unknown>;
    const result = await env.DB.prepare('INSERT INTO books (title, category, price, available, image_url, ig_url) VALUES (?, ?, ?, ?, ?, ?) RETURNING *').bind(body.title, body.category ?? 'novel', body.price ?? 0, body.available ? 1 : 0, body.imageUrl ?? '', body.igUrl ?? '').first();
    return Response.json(result, { status: 201 });
  }
  if (!id) return new Response('Missing id', { status: 400 });
  if (request.method === 'DELETE') { await env.DB.prepare('DELETE FROM books WHERE id = ?').bind(id).run(); return new Response(null, { status: 204 }); }
  if (request.method === 'PUT') { const body = await request.json() as Record<string, unknown>; const result = await env.DB.prepare('UPDATE books SET title=?, category=?, price=?, available=?, image_url=?, ig_url=?, updated_at=CURRENT_TIMESTAMP WHERE id=? RETURNING *').bind(body.title, body.category, body.price, body.available ? 1 : 0, body.imageUrl ?? '', body.igUrl ?? '', id).first(); return Response.json(result); }
  return new Response('Method not allowed', { status: 405 });
};
