import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
}

export interface SavedScenario {
  id: string;
  name: string;
  tool_type: string;
  input_json: any;
  output_json: any;
  is_private: boolean;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name?: string;
  role: string;
  created_at: string;
}

export const authService = {
  // Auth methods
  async signUp(email: string, password: string, fullName?: string) {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: fullName ? { full_name: fullName } : undefined
      }
    });
    
    return { data, error };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    return { data, error };
  },

  async signInWithGoogle() {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl
      }
    });
    
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async getCurrentSession(): Promise<Session | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  // Profile methods
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return data;
  },

  async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId);
    
    return { data, error };
  },

  // Scenario methods
  async saveScenario(scenarioData: {
    name: string;
    tool_type: string;
    input_json: any;
    output_json: any;
    is_private?: boolean;
  }) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('saved_scenarios')
      .insert({
        user_id: user.id,
        ...scenarioData,
        is_private: scenarioData.is_private ?? true
      })
      .select()
      .single();

    return { data, error };
  },

  async getSavedScenarios(): Promise<SavedScenario[]> {
    const user = await this.getCurrentUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('saved_scenarios')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching saved scenarios:', error);
      return [];
    }

    return data || [];
  },

  async deleteScenario(scenarioId: string) {
    const { error } = await supabase
      .from('saved_scenarios')
      .delete()
      .eq('id', scenarioId);

    return { error };
  },

  // Bookmark methods
  async saveBookmark(contentId: string) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('bookmarks')
      .insert({
        user_id: user.id,
        content_id: contentId
      });

    return { data, error };
  },

  async getBookmarks() {
    const user = await this.getCurrentUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookmarks:', error);
      return [];
    }

    return data || [];
  },

  async deleteBookmark(contentId: string) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', user.id)
      .eq('content_id', contentId);

    return { error };
  }
};