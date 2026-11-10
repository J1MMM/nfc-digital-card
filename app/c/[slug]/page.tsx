import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowUpRight, BriefcaseBusiness, Camera, Download, Globe2, Mail, MessageCircle, Music2, Phone, UsersRound } from 'lucide-react';
import { getCardBySlug } from '../../../lib/cards-store';
import { CopyButton } from '../../../components/copy-button';
import { ShareButton } from '../../../components/share-button';

export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ slug: string }> };

async function getCard(slug: string) { return getCardBySlug(slug); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const card = await getCard(slug);
  if (!card) return { title: 'Card not found' };
  return { title: `${card.name} · Digital contact card`, description: [card.title, card.company, card.bio].filter(Boolean).join(' · ') || `Connect with ${card.name}.`, openGraph: { title: card.name, description: [card.title, card.company].filter(Boolean).join(' · ') } };
}

function ContactRow({ icon, label, value, href, copyValue, external = false }: { icon: React.ReactNode; label: string; value: string; href: string; copyValue?: string; external?: boolean }) {
  return <div className="contact-row"><div className="contact-icon">{icon}</div><div className="contact-copy"><span>{label}</span><a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{value}{external && <ArrowUpRight size={15}/>}</a></div><CopyButton value={copyValue || (href.startsWith('http') ? href : value)} label={`Copy ${label.toLowerCase()}`} className="icon-button"/></div>;
}

export default async function PublicCard({ params }: Props) {
  const { slug } = await params;
  const card = await getCard(slug);
  if (!card) notFound();
  const social = [
    { label: 'LinkedIn', url: card.linkedin, icon: <BriefcaseBusiness size={19}/> },
    { label: 'Instagram', url: card.instagram, icon: <Camera size={19}/> },
    { label: 'Facebook', url: card.facebook, icon: <UsersRound size={19}/> },
    { label: 'TikTok', url: card.tiktok, icon: <Music2 size={19}/> },
  ].filter(item => item.url);
  const phoneHref = `tel:${card.phone.replace(/[^\d+]/g, '')}`;
  return <main className="public-shell"><div className="public-top"><ShareButton name={card.name}/></div>
    <article className="profile-card"><div className="portrait-side"><div className="portrait-frame">{card.photoKey ? <img src={`/media/${card.photoKey}`} alt={`Portrait of ${card.name}`}/> : <div className="portrait-placeholder" aria-label="No portrait uploaded"><span>{card.name.split(/\s+/).slice(0, 2).map(part => part[0]?.toUpperCase()).join('')}</span></div>}</div></div>
      <div className="profile-content"><div className="profile-main"><div className="identity-block"><div className="identity-top"><span>Connect with</span><span className="tiny-rule"/></div><h1>{card.name}</h1><p className="jobline">{[card.title, card.company].filter(Boolean).join(' · ') || 'Let’s connect'}</p>{card.bio && <p className="profile-bio">{card.bio}</p>}</div>
        <div className="primary-actions">{card.phone && <a className="button primary" href={phoneHref}><Phone size={18}/> Call now</a>}<a className="button secondary" href={`/c/${card.slug}/contact.vcf`} download><Download size={18}/> Save contact</a></div>
        <div className="contact-list"><h2>Contact details</h2>{card.phone && <ContactRow icon={<Phone size={19}/>} label="Phone" value={card.phone} href={phoneHref} />}{card.phone && <ContactRow icon={<MessageCircle size={19}/>} label="Text message" value={`Message ${card.name.split(' ')[0]}`} href={`sms:${card.phone.replace(/[^\d+]/g, '')}`} copyValue={card.phone} />}{card.email && <ContactRow icon={<Mail size={19}/>} label="Email" value={card.email} href={`mailto:${card.email}`} />}{card.website && <ContactRow icon={<Globe2 size={19}/>} label="Website" value={new URL(card.website).host + new URL(card.website).pathname.replace(/\/$/, '')} href={card.website} external />}</div>
        {social.length > 0 && <div className="social-section"><h2>Find me online</h2><div className="social-links">{social.map(item => <a href={item.url} key={item.label} target="_blank" rel="noopener noreferrer">{item.icon}<span>{item.label}</span><ArrowUpRight size={16}/></a>)}</div></div>}
      </div></div></article>
    <p className="public-after">Want to keep these details? <a href={`/c/${card.slug}/contact.vcf`} download>Save to your contacts</a></p>
  </main>;
}
