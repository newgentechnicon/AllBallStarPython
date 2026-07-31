import { LoginView } from '@/features/auth/components/login-view'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; status?: string; error?: string }>
}) {
  const { next, status, error } = await searchParams

  return <LoginView next={next} status={status} error={error} />
}
