import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return <main className="not-found"><h1>That card isn’t here.</h1><p>Check the link on your NFC tag, or ask the person who shared it for an updated URL.</p><Link href="/" className="button primary"><ArrowLeft size={17}/> Back to home</Link></main>;
}
