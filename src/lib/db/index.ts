/**
 * Data Access Layer — The Database Boundary
 *
 * ALL database calls go through files in this directory.
 * Components, pages, and API routes import from here — never from Supabase directly.
 *
 * Why: If engineering switches from Supabase to MongoDB (or anything else),
 * only these files change. Every component, page, and API route stays the same.
 *
 * Pattern:
 *   - Each file exports functions for one domain (cards, profiles, boards, etc.)
 *   - Functions take a Supabase client as the first argument (injected by the caller)
 *   - Functions return typed data using the interfaces in ../types.ts
 *   - Error handling is consistent: { data, error } pattern
 */

export * from './boards';
export * from './cards';
export * from './profiles';
export * from './comments';
export * from './notifications';
export * from './activity';
export * from './approval-rules';
