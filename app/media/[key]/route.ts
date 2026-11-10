import { downloadPhoto } from '../../../lib/cards-store';

export async function GET(_request: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!/^[0-9a-f-]{36}$/.test(key)) return new Response('Not found', { status: 404 });
  const object = await downloadPhoto(key);
  if (!object) return new Response('Not found', { status: 404 });
  return new Response(object, { headers: { 'Content-Type': object.type || 'application/octet-stream', 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff' } });
}
