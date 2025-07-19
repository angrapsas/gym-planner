import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tnkuehdjclogwtcthxjq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRua3VlaGRqY2xvZ3d0Y3RoeGpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NDkwODYsImV4cCI6MjA2ODEyNTA4Nn0.XIIB8CbQG3RZI1oPnuYjTiSz3RIch7abi4umBoHrsEw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 