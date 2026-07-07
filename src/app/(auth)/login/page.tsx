import { LoginView } from '@/features/auth/components/login-view'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams

  return <LoginView next={next} />
}
