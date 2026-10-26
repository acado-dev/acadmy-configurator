import { useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { CommunityRole } from '@/lib/communities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Loader2 } from 'lucide-react';
export type CommunityIdentity = { id: string; name: string; roles: CommunityRole[] };
export default function CommunityAccess({ children, learner = false, organization = false }: { children: (identity: CommunityIdentity) => ReactNode; learner?: boolean; organization?: boolean }) {
  const [identity, setIdentity] = useState<CommunityIdentity | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  useEffect(() => {
    let live = true; let revision = 0;
    const load = async () => {
      const current = ++revision;
      const { data, error: authError } = await supabase.auth.getUser();
      if (!live || current !== revision) return;
      if (authError || !data.user) { setIdentity(null); setLoading(false); return; }
      const roles = await supabase.from('user_roles').select('*').eq('user_id', data.user.id);
      if (!live || current !== revision) return;
      if (roles.error) { setError(roles.error.message); setIdentity(null); }
      else setIdentity({ id: data.user.id, name: data.user.user_metadata?.name || 'Member', roles: roles.data ?? [] });
      setLoading(false);
    };
    void load();
    const { data: listener } = supabase.auth.onAuthStateChange(() => { setTimeout(() => { if (live) void load(); }, 0); });
    return () => { live = false; listener.subscription.unsubscribe(); };
  }, []);
  if (loading) return <div className="flex items-center gap-2 py-12 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" />Loading communities…</div>;
  const allowed = identity?.roles.some(r => learner ? ['learner', 'organization_admin', 'super_admin'].includes(r.role) : organization ? r.role === 'organization_admin' && !!r.university_id : r.role === 'super_admin');
  if (identity && allowed) return <>{children(identity)}</>;
  if (identity) return <section className="max-w-xl py-10 space-y-4"><ShieldCheck className="h-8 w-8 text-primary" /><h1 className="text-2xl font-semibold">Community access not assigned</h1><p className="text-muted-foreground">Your verified account needs {learner ? 'a university assignment' : organization ? 'Organization Admin access and a university assignment' : 'Super Admin access'} before you can open this section.</p><Button variant="outline" onClick={async () => { await supabase.auth.signOut(); }}>Use another account</Button></section>;
  return <section className="max-w-md py-8 space-y-6"><div className="space-y-2"><ShieldCheck className="h-8 w-8 text-primary" /><h1 className="text-2xl font-semibold">{learner ? 'Community sign-in' : 'Verified admin sign-in'}</h1><p className="text-muted-foreground">Sign in with your verified ACADO account to access communities. Demo dashboard sign-in does not grant access.</p></div><form className="space-y-4" onSubmit={async e => { e.preventDefault(); setBusy(true); setError(''); const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) setError(error.message); setPassword(''); setBusy(false); }}><div className="space-y-2"><Label htmlFor="community-email">Email</Label><Input id="community-email" type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} required /></div><div className="space-y-2"><Label htmlFor="community-password">Password</Label><Input id="community-password" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required /></div>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</Button></form></section>;
}
