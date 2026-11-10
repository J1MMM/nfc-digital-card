import { getCardBySlug } from '../../../../lib/cards-store';
import { makeVcard } from '../../../../lib/card';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const card = await getCardBySlug(slug);
  if (!card) return new Response('Card not found', { status: 404 });
  const origin = new URL(request.url).origin;
  const body = makeVcard(card, `${origin}/c/${card.slug}`, card.photoKey ? `${origin}/media/${card.photoKey}` : undefined);
  const safeName = card.name.replace(/[^a-z0-9-]+/gi, '-').replace(/^-|-$/g, '') || 'contact';
  return new Response(body, { headers: { 'Content-Type': 'text/vcard; charset=utf-8', 'Content-Disposition': `attachment; filename="${safeName}.vcf"`, 'Cache-Control': 'no-store' } });
}
