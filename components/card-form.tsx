'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { ImagePlus, Save } from 'lucide-react';
import type { Card } from '../lib/cards-store';
import { saveCardAction } from '../app/admin/actions';

function Submit({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();
  return <button className="button primary" type="submit" disabled={pending}><Save size={17}/>{pending ? 'Saving…' : editing ? 'Save changes' : 'Create card'}</button>;
}

function TextField({ label, name, value, type = 'text', hint, placeholder, required = false }: { label: string; name: string; value?: string; type?: string; hint?: string; placeholder?: string; required?: boolean }) {
  return <label className="field"><span>{label}{required && <b> *</b>}</span><input name={name} type={type} defaultValue={value || ''} placeholder={placeholder} required={required} />{hint && <small>{hint}</small>}</label>;
}

export function CardForm({ card }: { card?: Card }) {
  const [state, action] = useActionState(saveCardAction, { error: '' });
  return <form className="card-form" action={action}>
    {card && <input type="hidden" name="id" value={card.id} />}
    <section className="form-section"><div className="section-heading"><h2>Identity</h2><p>The first things people see when they open the card.</p></div>
      <div className="form-fields"><div className="form-grid"><TextField label="Full name" name="name" value={card?.name} placeholder="e.g. Alex Morgan" required /><TextField label="Role or title" name="title" value={card?.title} placeholder="e.g. Creative Director" /></div>
        <TextField label="Company" name="company" value={card?.company} placeholder="e.g. Studio North" />
        <label className="field"><span>Short introduction</span><textarea name="bio" defaultValue={card?.bio || ''} maxLength={600} rows={4} placeholder="A short sentence about this person and what they do." /><small>Keep it brief so the contact actions stay easy to find.</small></label>
        <label className="field"><span>Profile photo</span><div className="photo-input-row">{card?.photoKey ? <img className="photo-mini" src={`/media/${card.photoKey}`} alt="Current profile" /> : <div className="photo-mini placeholder"><ImagePlus size={21}/></div>}<input type="file" name="photo" accept="image/jpeg,image/png,image/webp,image/avif" /></div><small>JPG, PNG, WebP, or AVIF. Maximum 3 MB. A monogram appears until a photo is added.</small></label>
      </div></section>
    <section className="form-section"><div className="section-heading"><h2>Direct contact</h2><p>These become tap-to-call, message, and email actions.</p></div>
      <div className="form-fields"><div className="form-grid"><TextField label="Mobile number" name="phone" type="tel" value={card?.phone} placeholder="+63 917 123 4567" /><TextField label="Email address" name="email" type="email" value={card?.email} placeholder="alex@example.com" /></div><TextField label="Website" name="website" value={card?.website} placeholder="example.com" /></div></section>
    <section className="form-section"><div className="section-heading"><h2>Social links</h2><p>Add only the places this person wants visitors to use.</p></div>
      <div className="form-fields form-grid"><TextField label="LinkedIn" name="linkedin" value={card?.linkedin} placeholder="linkedin.com/in/…" /><TextField label="Instagram" name="instagram" value={card?.instagram} placeholder="instagram.com/…" /><TextField label="Facebook" name="facebook" value={card?.facebook} placeholder="facebook.com/…" /><TextField label="TikTok" name="tiktok" value={card?.tiktok} placeholder="tiktok.com/@…" /></div></section>
    {state.error && <p role="alert" className="form-error">{state.error}</p>}
    <div className="form-footer"><p>{card ? 'The card URL stays the same when you save changes.' : 'A unique permanent link is created when you save.'}</p><Submit editing={!!card}/></div>
  </form>;
}
