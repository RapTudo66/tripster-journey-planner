
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://anxmhcprnndtuodmgyea.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFueG1oY3Bybm5kdHVvZG1neWVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzOTIzMzgsImV4cCI6MjA1NTk2ODMzOH0.lT4DUJILUGfhQDqjOYi93Ee0vR5U8L32PNqG9JgUOT0';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
};

export type Trip = {
  id: string;
  user_id: string;
  name: string;
  num_people: number;
  created_at: string;
  country?: string; // Adicionando o campo country como opcional
  city?: string; // Adicionando o campo city como opcional
  title?: string; // Adicionando suporte para o campo title usado em algumas partes
  description?: string; // Adicionando suporte para o campo description
  start_date?: string; // Adicionando suporte para o campo de data inicial
  end_date?: string; // Adicionando suporte para o campo de data final
};

export type Expense = {
  id: string;
  user_id: string;
  trip_id: string;
  category: string;
  amount: number;
  description: string;
  created_at: string;
  date?: string; // Adicionando o campo date como opcional
};
