import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/database.types'
import { getSupabaseEnv } from './env'

export function createClient() {
  const { supabaseUrl, supabaseKey } = getSupabaseEnv()

  return createBrowserClient<Database>(supabaseUrl, supabaseKey)
}
