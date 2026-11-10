import Link from 'next/link';
import { ArrowLeft, LockKeyhole } from 'lucide-react';
import { loginAction } from './actions';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <main className="login-screen">
    <Link className="back-link" href="/"><ArrowLeft size={17}/> Back to home</Link>
    <section className="login-panel">
      <div className="login-icon"><LockKeyhole size={23}/></div>
      <h1>Admin sign in</h1>
      <p>Enter your administrator password to create and edit digital cards.</p>
      <form action={loginAction} className="login-form">
        <label htmlFor="password">Password</label>
        <input id="password" type="password" name="password" autoComplete="current-password" required autoFocus />
        {error && <p className="form-error" role="alert">That password didn’t match. Try again.</p>}
        <button className="button primary" type="submit">Continue to dashboard</button>
      </form>
    </section>
  </main>;
}
