-- =============================================================
-- TLH Skill Hub — RLS Fixes & Profile Insert Policy
-- Migration 002
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- =============================================================

-- 1. Allow users to insert their own profile (fallback if trigger doesn't fire)
-- The handle_new_user() trigger is SECURITY DEFINER so bypasses RLS,
-- but the middleware fallback uses the authenticated client which needs this policy.
CREATE POLICY "profiles_insert_self" ON profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());


-- 2. Allow engineering role to update cards in engineering_queued status
-- Engineers need to pick up cards (set assigned_to) from the queue,
-- but they're not the creator, assignee, or approver yet.
--
-- Drop and recreate the cards_update policy to include the engineering exception.
DROP POLICY IF EXISTS "cards_update" ON cards;

CREATE POLICY "cards_update" ON cards FOR UPDATE TO authenticated
  USING (
    created_by = auth.uid()
    OR assigned_to = auth.uid()
    OR current_approver_id = auth.uid()
    OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
    OR (
      (SELECT role FROM profiles WHERE id = auth.uid()) = 'engineering'
      AND status = 'engineering_queued'
    )
  );


-- 3. Allow any authenticated user to insert activity_log entries
-- Currently requires actor_id = auth.uid(), which is correct.
-- But we also need insert policy for system-generated entries (approval routing).
-- The current policy is fine — routing always uses the creator's ID as actor.


-- 4. Allow department_head role to update cards in their department
-- Department heads should be able to approve/move cards within their dept.
-- (This is already partially handled by current_approver_id, but this makes
--  it explicit for department-scoped oversight.)
DROP POLICY IF EXISTS "cards_update" ON cards;

CREATE POLICY "cards_update" ON cards FOR UPDATE TO authenticated
  USING (
    created_by = auth.uid()
    OR assigned_to = auth.uid()
    OR current_approver_id = auth.uid()
    OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
    OR (
      (SELECT role FROM profiles WHERE id = auth.uid()) = 'engineering'
      AND status = 'engineering_queued'
    )
    OR (
      (SELECT role FROM profiles WHERE id = auth.uid()) = 'department_head'
      AND department = (SELECT department FROM profiles WHERE id = auth.uid())
    )
  );
