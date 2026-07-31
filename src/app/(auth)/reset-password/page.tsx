import { redirect } from 'next/navigation';
import { ResetPasswordView } from '@/features/auth/components/reset-password-view';
import { createClient } from '@/lib/supabase/server';

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect('/login?error=recovery_link_invalid');
  }

  return <ResetPasswordView />;
}
