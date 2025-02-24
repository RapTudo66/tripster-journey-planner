
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://YOUR_PROJECT_URL.supabase.co';
const supabaseKey = 'YOUR_PUBLIC_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
};

export type Expense = {
  id: string;
  user_id: string;
  category: string;
  amount: number;
  description: string;
  created_at: string;
};
