type Env = { BUCKET: R2Bucket; R2_PUBLIC_URL: string };

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File) || !file.type.startsWith('image/')) {
    return Response.json({ error: 'กรุณาเลือกไฟล์รูปภาพ' }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return Response.json({ error: 'ไฟล์ต้องมีขนาดไม่เกิน 5MB' }, { status: 400 });
  }
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const key = `books/${crypto.randomUUID()}.${extension}`;
  await env.BUCKET.put(key, file.stream(), { httpMetadata: { contentType: file.type, cacheControl: 'public, max-age=31536000, immutable' } });
  return Response.json({ imageUrl: `${env.R2_PUBLIC_URL.replace(/\/$/, '')}/${key}` });
};
