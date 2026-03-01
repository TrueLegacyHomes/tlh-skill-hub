-- =============================================================
-- TLH Skill Hub — Kanban System Database Schema
-- Migration 001: Initial setup
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- =============================================================

-- ENUMS
CREATE TYPE user_role AS ENUM (
  'admin',
  'department_head',
  'team_member',
  'engineering'
);

CREATE TYPE department AS ENUM (
  'executive',
  'operations',
  'interior_design',
  'estate_sales',
  'home_acquisitions',
  'care_placement',
  'marketing',
  'engineering'
);

CREATE TYPE card_status AS ENUM (
  'submitted',
  'under_review',
  'changes_requested',
  'approved',
  'engineering_queued',
  'in_progress',
  'done',
  'archived'
);

CREATE TYPE card_type AS ENUM (
  'problem_definition',
  'sop',
  'new_product_plan',
  'system_change_request',
  'report_dashboard',
  'automation_plan',
  'template',
  'skill_improvement',
  'engineering_build',
  'other'
);

CREATE TYPE impact_level AS ENUM ('high', 'medium', 'low');
CREATE TYPE urgency_level AS ENUM ('blocking', 'important', 'nice_to_have');

CREATE TYPE notification_type AS ENUM (
  'card_submitted',
  'card_assigned',
  'approval_needed',
  'card_approved',
  'card_rejected',
  'changes_requested',
  'comment_added',
  'card_moved',
  'mention'
);


-- =============================================================
-- PROFILES (extends Supabase auth.users)
-- =============================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'team_member',
  department department NOT NULL DEFAULT 'operations',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, department)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'team_member',
    'operations'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- =============================================================
-- BOARDS & COLUMNS
-- =============================================================

CREATE TABLE boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE columns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status card_status NOT NULL,
  position INTEGER NOT NULL,
  wip_limit INTEGER,
  color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(board_id, position)
);


-- =============================================================
-- CARDS
-- =============================================================

CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES boards(id),
  column_id UUID NOT NULL REFERENCES columns(id),

  -- Core
  title TEXT NOT NULL,
  description TEXT,
  card_type card_type NOT NULL,
  status card_status NOT NULL DEFAULT 'submitted',
  position INTEGER NOT NULL DEFAULT 0,

  -- Who
  created_by UUID NOT NULL REFERENCES profiles(id),
  assigned_to UUID REFERENCES profiles(id),
  department department NOT NULL,

  -- Goal/Skill context
  goal TEXT,
  skills_used TEXT[],
  workflow_name TEXT,

  -- Deliverables
  deliverable_summary TEXT,
  deliverable_url TEXT,

  -- Impact scoring
  priority INTEGER NOT NULL DEFAULT 2,       -- 1=P1, 2=P2, 3=P3
  estimated_impact impact_level NOT NULL DEFAULT 'medium',
  time_saved_hours NUMERIC(5,1) DEFAULT 0,
  urgency urgency_level NOT NULL DEFAULT 'important',
  composite_score INTEGER NOT NULL DEFAULT 0,

  -- Approval
  current_approver_id UUID REFERENCES profiles(id),
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,

  -- Timestamps
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_cards_board_column ON cards(board_id, column_id);
CREATE INDEX idx_cards_status ON cards(status);
CREATE INDEX idx_cards_assigned ON cards(assigned_to);
CREATE INDEX idx_cards_department ON cards(department);
CREATE INDEX idx_cards_created_by ON cards(created_by);
CREATE INDEX idx_cards_approver ON cards(current_approver_id);
CREATE INDEX idx_cards_composite_score ON cards(composite_score DESC);

-- Auto-calculate composite score on insert/update
CREATE OR REPLACE FUNCTION calculate_composite_score()
RETURNS TRIGGER AS $$
BEGIN
  NEW.composite_score := (
    CASE NEW.priority WHEN 1 THEN 30 WHEN 2 THEN 20 WHEN 3 THEN 10 ELSE 10 END
    + CASE NEW.estimated_impact WHEN 'high' THEN 30 WHEN 'medium' THEN 20 WHEN 'low' THEN 10 ELSE 10 END
    + LEAST(COALESCE(NEW.time_saved_hours, 0) * 5, 50)::INTEGER
    + CASE NEW.urgency WHEN 'blocking' THEN 30 WHEN 'important' THEN 20 WHEN 'nice_to_have' THEN 10 ELSE 10 END
  );
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cards_calculate_score
  BEFORE INSERT OR UPDATE ON cards
  FOR EACH ROW EXECUTE FUNCTION calculate_composite_score();


-- =============================================================
-- LABELS
-- =============================================================

CREATE TABLE labels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL DEFAULT '#38b5ad'
);

CREATE TABLE card_labels (
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  label_id UUID REFERENCES labels(id) ON DELETE CASCADE,
  PRIMARY KEY (card_id, label_id)
);


-- =============================================================
-- COMMENTS
-- =============================================================

CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id),
  body TEXT NOT NULL,
  is_system BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_comments_card ON comments(card_id, created_at);


-- =============================================================
-- ACTIVITY LOG
-- =============================================================

CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID REFERENCES cards(id) ON DELETE SET NULL,
  actor_id UUID NOT NULL REFERENCES profiles(id),
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_activity_card ON activity_log(card_id, created_at DESC);
CREATE INDEX idx_activity_actor ON activity_log(actor_id, created_at DESC);
CREATE INDEX idx_activity_created ON activity_log(created_at DESC);


-- =============================================================
-- APPROVAL RULES
-- =============================================================

CREATE TABLE approval_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,

  -- Match conditions (NULL = any)
  match_card_type card_type,
  match_department department,
  match_creator_role user_role,
  match_goal TEXT,

  -- Routing target
  route_to_role user_role,
  route_to_department department,
  route_to_user_id UUID REFERENCES profiles(id),

  -- Post-approval behavior
  next_status card_status NOT NULL DEFAULT 'approved',
  auto_move_to_engineering BOOLEAN NOT NULL DEFAULT false,
  requires_approval BOOLEAN NOT NULL DEFAULT true,

  priority INTEGER NOT NULL DEFAULT 100,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- =============================================================
-- NOTIFICATIONS
-- =============================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES profiles(id),
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_recipient ON notifications(recipient_id, is_read, created_at DESC);


-- =============================================================
-- SUBMISSION TOKENS (for Claude Code → Skill Hub API bridge)
-- =============================================================

CREATE TABLE submission_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  goal TEXT,
  skills TEXT[],
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tokens_token ON submission_tokens(token);


-- =============================================================
-- ROW LEVEL SECURITY
-- =============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_tokens ENABLE ROW LEVEL SECURITY;

-- Profiles: all authenticated can read, self-update, admin can update any
CREATE POLICY "profiles_select" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_update_self" ON profiles FOR UPDATE TO authenticated
  USING (id = auth.uid());
CREATE POLICY "profiles_update_admin" ON profiles FOR UPDATE TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Boards & Columns: all authenticated can read
CREATE POLICY "boards_select" ON boards FOR SELECT TO authenticated USING (true);
CREATE POLICY "columns_select" ON columns FOR SELECT TO authenticated USING (true);

-- Cards: read own, department, assigned, or admin/engineering
CREATE POLICY "cards_select" ON cards FOR SELECT TO authenticated
  USING (
    created_by = auth.uid()
    OR assigned_to = auth.uid()
    OR current_approver_id = auth.uid()
    OR department = (SELECT department FROM profiles WHERE id = auth.uid())
    OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'engineering')
  );
CREATE POLICY "cards_insert" ON cards FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());
CREATE POLICY "cards_update" ON cards FOR UPDATE TO authenticated
  USING (
    created_by = auth.uid()
    OR assigned_to = auth.uid()
    OR current_approver_id = auth.uid()
    OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Labels: all authenticated can read
CREATE POLICY "labels_select" ON labels FOR SELECT TO authenticated USING (true);
CREATE POLICY "card_labels_select" ON card_labels FOR SELECT TO authenticated USING (true);

-- Comments: read comments on cards you can see, create on cards you can see
CREATE POLICY "comments_select" ON comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "comments_insert" ON comments FOR INSERT TO authenticated
  WITH CHECK (author_id = auth.uid());

-- Activity log: all authenticated can read
CREATE POLICY "activity_select" ON activity_log FOR SELECT TO authenticated USING (true);
CREATE POLICY "activity_insert" ON activity_log FOR INSERT TO authenticated
  WITH CHECK (actor_id = auth.uid());

-- Approval rules: all authenticated can read, admin can modify
CREATE POLICY "rules_select" ON approval_rules FOR SELECT TO authenticated USING (true);
CREATE POLICY "rules_modify" ON approval_rules FOR ALL TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Notifications: own only
CREATE POLICY "notifications_select" ON notifications FOR SELECT TO authenticated
  USING (recipient_id = auth.uid());
CREATE POLICY "notifications_update" ON notifications FOR UPDATE TO authenticated
  USING (recipient_id = auth.uid());
CREATE POLICY "notifications_insert" ON notifications FOR INSERT TO authenticated
  WITH CHECK (true);

-- Submission tokens: own only, plus service role can insert
CREATE POLICY "tokens_select" ON submission_tokens FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "tokens_insert" ON submission_tokens FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());


-- =============================================================
-- SEED DATA
-- =============================================================

-- Default board
INSERT INTO boards (id, name, description, is_default) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Main Board', 'Primary workflow board for all departments', true);

-- Default columns
INSERT INTO columns (board_id, name, status, position, color) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Submitted',         'submitted',          0, '#6b7280'),
  ('00000000-0000-0000-0000-000000000001', 'Under Review',      'under_review',       1, '#f59e0b'),
  ('00000000-0000-0000-0000-000000000001', 'Changes Requested', 'changes_requested',  2, '#ef4444'),
  ('00000000-0000-0000-0000-000000000001', 'Approved',          'approved',           3, '#38b5ad'),
  ('00000000-0000-0000-0000-000000000001', 'Engineering Queue',  'engineering_queued', 4, '#0f4676'),
  ('00000000-0000-0000-0000-000000000001', 'In Progress',       'in_progress',        5, '#a47eaf'),
  ('00000000-0000-0000-0000-000000000001', 'Done',              'done',               6, '#10b981');

-- Default approval rules
-- Cards needing approval
INSERT INTO approval_rules (name, description, match_card_type, requires_approval, route_to_role, next_status, auto_move_to_engineering, priority) VALUES
  ('Skill improvements need admin', 'Skill changes must be approved by admin before publishing', 'skill_improvement', true, 'admin', 'approved', false, 10),
  ('System changes need admin', 'System change requests must be approved by admin', 'system_change_request', true, 'admin', 'approved', true, 20),
  ('New product plans need admin', 'New product plans must be approved by admin', 'new_product_plan', true, 'admin', 'approved', true, 30);

-- Cards that auto-flow (no approval needed)
INSERT INTO approval_rules (name, description, match_card_type, requires_approval, auto_move_to_engineering, priority) VALUES
  ('Problem definitions auto-flow', 'Problem definitions go straight to engineering', 'problem_definition', false, true, 40),
  ('Automation plans auto-flow', 'Automation plans go straight to engineering', 'automation_plan', false, true, 50),
  ('Reports auto-flow', 'Reports and dashboards go straight to engineering', 'report_dashboard', false, true, 60),
  ('SOPs may not need engineering', 'SOPs go to done unless engineering work is needed', 'sop', false, false, 70),
  ('Templates go to done', 'Templates are documentation only', 'template', false, false, 80);

-- Default catch-all rule
INSERT INTO approval_rules (name, description, requires_approval, route_to_role, next_status, auto_move_to_engineering, priority) VALUES
  ('Default: route to admin', 'Catch-all rule for unmatched card types', true, 'admin', 'approved', false, 999);

-- Default labels
INSERT INTO labels (name, color) VALUES
  ('Urgent', '#ef4444'),
  ('Bug Fix', '#f59e0b'),
  ('New Feature', '#38b5ad'),
  ('Process Improvement', '#0f4676'),
  ('Documentation', '#6b7280'),
  ('Automation', '#a47eaf');
