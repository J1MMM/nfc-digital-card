'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function CopyButton({ value, label = 'Copy', className = '', showLabel = false }: { value: string; label?: string; className?: string; showLabel?: boolean }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value.startsWith('/') ? `${window.location.origin}${value}` : value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch { setCopied(false); }
  }
  return <button type="button" className={className} onClick={copy} aria-label={copied ? 'Copied' : label} title={copied ? 'Copied' : label}>
    {copied ? <Check size={17} /> : <Copy size={17} />}{showLabel && <span>{copied ? 'Copied' : label}</span>}
  </button>;
}
