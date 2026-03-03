import { createClient } from '@supabase/supabase-js'

// Suas chaves configuradas
const supabaseUrl = 'https://zbnpwicdgobxkvesgayr.supabase.co'
const supabaseAnonKey = 'sb_publishable_Bw_NeyC1z_bHKnKOYjns0w_wAiAw5Lc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
