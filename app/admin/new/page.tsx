import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { requireAdmin } from '../../../lib/admin-auth';
import { AdminHeader } from '../../../components/admin-header';
import { CardForm } from '../../../components/card-form';

export const dynamic = 'force-dynamic';
export default async function NewCardPage() {
  await requireAdmin();
  return <div className="admin-app"><AdminHeader/><main className="admin-main form-page"><Link href="/admin" className="back-link"><ArrowLeft size={17}/> All cards</Link><div className="form-page-head"><h1>Create a card</h1><p>Add a person’s details, then copy the permanent link for their NFC tag.</p></div><CardForm/></main></div>;
}
