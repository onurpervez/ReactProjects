import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dobckrkkngyepduiluej.supabase.co'
const supabaseKey = 'sb_publishable__a50lXbW1w_dWfF737Lcog_lXr4ENsZ'

export const supabase = createClient(supabaseUrl, supabaseKey)