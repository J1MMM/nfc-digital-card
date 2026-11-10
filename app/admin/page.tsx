import Link from 'next/link';
import { ArrowUpRight, CreditCard, Plus, Users } from 'lucide-react';
import { listCards } from '../../lib/cards-store';
import { requireAdmin } from '../../lib/admin-auth';
import { AdminHeader } from '../../components/admin-header';
import { CopyButton } from '../../components/copy-button';

export const dynamic = 'force-dynamic';

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ created?: string; updated?: string }> }) {
  await requireAdmin();
  const list = await listCards();
  const params = await searchParams;
  const notice = params.created ? 'Card created. Copy its link for the NFC tag.' : params.updated ? 'Card updated. The public link is unchanged.' : '';
  return <div className="admin-app"><AdminHeader/><main className="admin-main">
    <div className="admin-topline"><div><h1>Cards</h1><p>Manage every digital calling card in one place.</p></div><Link className="button primary" href="/admin/new"><Plus size={18}/> New card</Link></div>
    {notice && <div className="notice" role="status">{notice}</div>}
    <div className="dashboard-stat"><div className="stat-icon"><Users size={20}/></div><div><strong>{list.length}</strong><span>{list.length === 1 ? 'active card' : 'active cards'}</span></div></div>
    <section className="list-panel"><div className="list-heading"><h2>All profiles</h2><span>Public links are ready for NFC tags</span></div>
      {list.length === 0 ? <div className="empty-state"><div className="empty-icon"><CreditCard size={26}/></div><h3>Your first card starts here</h3><p>Add a name and contact details. We’ll make a dedicated link you can put on an NFC tag.</p><Link href="/admin/new" className="button primary"><Plus size={17}/> Create a card</Link></div> :
      <div className="card-list">{list.map(card => <div className="card-list-row" key={card.id}><div className="list-avatar">{card.photoKey ? <img src={`/media/${card.photoKey}`} alt=""/> : card.name.charAt(0)}</div><div className="list-person"><strong>{card.name}</strong><span>{[card.title, card.company].filter(Boolean).join(' · ') || 'Digital contact card'}</span></div><div className="list-url">/c/{card.slug}</div><CopyButton value={`/c/${card.slug}`} label="Copy link" showLabel className="row-copy"/><Link className="row-open" href={`/c/${card.slug}`} target="_blank" aria-label={`Open ${card.name}'s card`}><ArrowUpRight size={18}/></Link><Link className="row-edit" href={`/admin/${card.id}`}>Edit</Link></div>)}</div>}
    </section><p className="dashboard-note">Tip: Program the public <strong>/c/…</strong> link onto each NFC tag. Updates to a card appear at the same URL.</p>
  </main></div>;
}
