import { supabase } from "@/integrations/supabase/client";

/**
 * Helper to handle untyped Supabase tables when schema is not yet defined.
 * This bypasses TypeScript's strict type checking for table names.
 * 
 * Usage: db('table_name').select('*')
 */
export const db = (table: string): any => {
  // @ts-ignore - Supabase schema not yet defined, bypass strict typing
  return supabase.from(table);
};
