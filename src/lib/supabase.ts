import { createClient } from '@supabase/supabase-js';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isLocalConfigured: boolean;
  isEnvConfigured: boolean;
  isConnected: boolean;
}

// Retrieve credentials from environment variables or LocalStorage
export const getSupabaseConfig = (): SupabaseConfig => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const localUrl = localStorage.getItem('supabase_url') || '';
  const localKey = localStorage.getItem('supabase_anon_key') || '';

  const finalUrl = localUrl || envUrl;
  const finalKey = localKey || envKey;

  return {
    url: finalUrl,
    anonKey: finalKey,
    isLocalConfigured: !!(localUrl && localKey),
    isEnvConfigured: !!(envUrl && envKey),
    isConnected: !!(finalUrl && finalKey)
  };
};

export const initSupabaseClient = () => {
  const { url, anonKey } = getSupabaseConfig();
  
  if (!url || !anonKey) {
    return null;
  }
  
  try {
    return createClient(url, anonKey);
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    return null;
  }
};

// Lazy loaded client
export let supabase = initSupabaseClient();

export const refreshSupabaseClient = () => {
  supabase = initSupabaseClient();
  return supabase;
};
