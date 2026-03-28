import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://paguercgutbqxuuscrny.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhZ3VlcmNndXRicXh1dXNjcm55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2NzE1MDYsImV4cCI6MjA5MDI0NzUwNn0.XS0CbEaH79HaqSzHU0OgeHivxaputVhBIaYQ7yEL3vE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
