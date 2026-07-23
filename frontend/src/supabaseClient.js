import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

const missingConfigClient = {
  from() {
    return {
      insert: async () => ({
        error: new Error('Faltan VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY en el archivo .env del frontend.'),
      }),
    };
  },
};

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : missingConfigClient;
