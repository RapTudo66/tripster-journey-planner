
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://anxmhcprnndtuodmgyea.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFueG1oY3Bybm5kdHVvZG1neWVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzOTIzMzgsImV4cCI6MjA1NTk2ODMzOH0.lT4DUJILUGfhQDqjOYi93Ee0vR5U8L32PNqG9JgUOT0';

export const supabase = createClient(supabaseUrl, supabaseKey);
