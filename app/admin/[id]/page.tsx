import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { getCardById } from '../../../lib/cards-store';
import { requireAdmin } from '../../../lib/admin-auth';
import { AdminHeader } from '../../../components/admin-header';
import { CardForm } from '../../../components/card-form';
import { CopyButton } from '../../../components/copy-button';

export const dynamic = 'force-dynamic';
export default async function EditCardPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const card = await getCardById(id);
  if (!card) notFound();
  return <div className="admin-app"><AdminHeader/><main className="admin-main form-page"><Link href="/admin" className="back-link"><ArrowLeft size={17}/> All cards</Link><div className="form-page-head"><h1>Edit {card.name}</h1><p>Changes appear at the same public URL.</p></div><div className="url-panel"><div><span>Public card URL</span><code>/c/{card.slug}</code></div><div><CopyButton value={`/c/${card.slug}`} label="Copy link" showLabel className="button secondary"/><Link href={`/c/${card.slug}`} target="_blank" className="button secondary"><ArrowUpRight size={17}/> Open card</Link></div></div><CardForm card={card}/></main></div>;
}
