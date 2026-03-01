/**
 * POST /api/tokens/generate
 *
 * Generate a short-lived submission token for the Claude Code → Skill Hub bridge.
 * Tokens are valid for 24 hours and tied to the user's account.
 *
 * The token is embedded in the Finder-generated Claude Code prompt so Claude Code
 * can authenticate the POST /api/cards/create call without requiring a browser session.
 *
 * Requires session-based auth (logged-in user on the Finder page).
 */
export const prerender = false;

import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../lib/supabase';

function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'tlh_';
  for (let i = 0; i < 48; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const supabase = createSupabaseServerClient(request, cookies);

  try {
    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json().catch(() => ({}));

    // Generate a token valid for 24 hours
    const token = generateToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const { data, error: insertError } = await supabase
      .from('submission_tokens')
      .insert({
        token,
        user_id: user.id,
        goal: body.goal || null,
        skills: body.skills || null,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      token,
      expires_at: expiresAt.toISOString(),
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal server error', details: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
