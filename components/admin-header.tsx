import Link from 'next/link';
import { ArrowUpRight, LogOut } from 'lucide-react';
import { logoutAction } from '../app/admin/actions';

export function AdminHeader() {
  return <header className="admin-header"><div className="admin-header-inner">
    <Link href="/admin" className="brand"><span>tapcard<span className="brand-light">studio</span></span></Link>
    <nav aria-label="Admin navigation"><Link href="/" target="_blank">View website <ArrowUpRight size={15}/></Link><form action={logoutAction}><button type="submit"><LogOut size={16}/> Sign out</button></form></nav>
  </div></header>;
}
