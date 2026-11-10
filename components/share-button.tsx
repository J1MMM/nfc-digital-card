'use client';

import { useState } from 'react';
import { Check, Share2 } from 'lucide-react';

export function ShareButton({ name }: { name: string }) {
  const [done, setDone] = useState(false);
  async function share() {
    try {
      if (navigator.share) await navigator.share({ title: `${name} · contact card`, url: window.location.href });
      else { await navigator.clipboard.writeText(window.location.href); setDone(true); window.setTimeout(() => setDone(false), 2000); }
    } catch { /* Visitor cancelled sharing. */ }
  }
  return <button type="button" className="share-button" onClick={share} aria-label={done ? 'Link copied' : 'Share this card'}>{done ? <Check size={19}/> : <Share2 size={19}/>}</button>;
}
