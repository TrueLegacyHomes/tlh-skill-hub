import type { SupabaseClient } from '@supabase/supabase-js';
import type { Profile, UserRole, Department } from '../types';

/** Get a single profile by user ID */
export async function getProfile(client: SupabaseClient, userId: string): Promise<Profile | null> {
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('getProfile error:', error.message);
    return null;
  }
  return data;
}

/** Get all active profiles */
export async function getAllProfiles(client: SupabaseClient): Promise<Profile[]> {
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('is_active', true)
    .order('full_name');

  if (error) {
    console.error('getAllProfiles error:', error.message);
    return [];
  }
  return data ?? [];
}

/** Get profiles by role */
export async function getProfilesByRole(client: SupabaseClient, role: UserRole): Promise<Profile[]> {
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('role', role)
    .eq('is_active', true);

  if (error) {
    console.error('getProfilesByRole error:', error.message);
    return [];
  }
  return data ?? [];
}

/** Get profiles by department */
export async function getProfilesByDepartment(client: SupabaseClient, dept: Department): Promise<Profile[]> {
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('department', dept)
    .eq('is_active', true);

  if (error) return [];
  return data ?? [];
}

/** Update a profile (admin use) */
export async function updateProfile(
  client: SupabaseClient,
  userId: string,
  updates: { role?: UserRole; department?: Department; full_name?: string; is_active?: boolean }
): Promise<{ error: string | null }> {
  const { error } = await client
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) return { error: error.message };
  return { error: null };
}
