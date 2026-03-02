-- =============================================================
-- TLH Skill Hub — Goals & Goal-Skill Associations
-- Migration 003
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- =============================================================

-- 1. Create the goals table
CREATE TABLE goals (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT,
  parent_id     UUID REFERENCES goals(id) ON DELETE SET NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create the goal_skills junction table
CREATE TABLE goal_skills (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id       UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  skill_id      TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(goal_id, skill_id)
);

-- 3. Indexes
CREATE INDEX idx_goals_parent ON goals(parent_id);
CREATE INDEX idx_goals_order ON goals(display_order);
CREATE INDEX idx_goal_skills_goal_order ON goal_skills(goal_id, display_order);

-- 4. Enable RLS
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_skills ENABLE ROW LEVEL SECURITY;

-- 5. RLS policies for goals
-- Anyone (including anon) can read goals — they're public content
CREATE POLICY "goals_select_anon" ON goals FOR SELECT TO anon USING (true);
CREATE POLICY "goals_select_auth" ON goals FOR SELECT TO authenticated USING (true);

-- Only admins can insert/update/delete goals
CREATE POLICY "goals_insert_admin" ON goals FOR INSERT TO authenticated
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "goals_update_admin" ON goals FOR UPDATE TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "goals_delete_admin" ON goals FOR DELETE TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- 6. RLS policies for goal_skills
CREATE POLICY "goal_skills_select_anon" ON goal_skills FOR SELECT TO anon USING (true);
CREATE POLICY "goal_skills_select_auth" ON goal_skills FOR SELECT TO authenticated USING (true);

CREATE POLICY "goal_skills_insert_admin" ON goal_skills FOR INSERT TO authenticated
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "goal_skills_update_admin" ON goal_skills FOR UPDATE TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "goal_skills_delete_admin" ON goal_skills FOR DELETE TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');


-- =============================================================
-- 7. Seed data — 8 goals matching the current Finder page
-- =============================================================

INSERT INTO goals (name, slug, description, display_order) VALUES
  ('Define a problem',             'define',    'Start by clearly defining the problem, then move to the right blueprint skill.',                          1),
  ('Build something new',          'build',     'Define the problem first, plan the product, then create a handoff brief for engineering.',                2),
  ('Automate a workflow',          'automate',  'Define the problem first, then plan the automation and reference your tools.',                            3),
  ('Document a process',           'document',  'Create SOPs or templates with standardized formats.',                                                    4),
  ('Create a report or dashboard', 'report',    'Plan your report or dashboard with the right metrics and data sources.',                                 5),
  ('Request a system change',      'change',    'Define the problem first, then submit a structured change request.',                                     6),
  ('Improve AI skills',            'improve',   'Use the skill builder to create new skills, quality checker to validate, and memory manager for context.',7),
  ('Look up company info',         'reference', 'These foundational skills provide company context and information.',                                     8);


-- =============================================================
-- 8. Seed goal_skills from current recommendedFor mappings
--    Order: Blueprints (2.xx) first, then Foundation (1.xx), by skillId
-- =============================================================

-- define: 2.01, 1.05, 1.06
INSERT INTO goal_skills (goal_id, skill_id, display_order)
SELECT g.id, s.skill_id, s.display_order
FROM goals g
CROSS JOIN (VALUES
  ('2.01', 0),
  ('1.05', 1),
  ('1.06', 2)
) AS s(skill_id, display_order)
WHERE g.slug = 'define';

-- build: 2.01, 2.03, 2.04, 1.04
INSERT INTO goal_skills (goal_id, skill_id, display_order)
SELECT g.id, s.skill_id, s.display_order
FROM goals g
CROSS JOIN (VALUES
  ('2.01', 0),
  ('2.03', 1),
  ('2.04', 2),
  ('1.04', 3)
) AS s(skill_id, display_order)
WHERE g.slug = 'build';

-- automate: 2.01, 2.06, 1.09
INSERT INTO goal_skills (goal_id, skill_id, display_order)
SELECT g.id, s.skill_id, s.display_order
FROM goals g
CROSS JOIN (VALUES
  ('2.01', 0),
  ('2.06', 1),
  ('1.09', 2)
) AS s(skill_id, display_order)
WHERE g.slug = 'automate';

-- document: 2.02, 2.07, 1.04
INSERT INTO goal_skills (goal_id, skill_id, display_order)
SELECT g.id, s.skill_id, s.display_order
FROM goals g
CROSS JOIN (VALUES
  ('2.02', 0),
  ('2.07', 1),
  ('1.04', 2)
) AS s(skill_id, display_order)
WHERE g.slug = 'document';

-- report: 2.05, 1.09
INSERT INTO goal_skills (goal_id, skill_id, display_order)
SELECT g.id, s.skill_id, s.display_order
FROM goals g
CROSS JOIN (VALUES
  ('2.05', 0),
  ('1.09', 1)
) AS s(skill_id, display_order)
WHERE g.slug = 'report';

-- change: 2.01, 2.04, 1.09
INSERT INTO goal_skills (goal_id, skill_id, display_order)
SELECT g.id, s.skill_id, s.display_order
FROM goals g
CROSS JOIN (VALUES
  ('2.01', 0),
  ('2.04', 1),
  ('1.09', 2)
) AS s(skill_id, display_order)
WHERE g.slug = 'change';

-- improve: 1.01, 1.02, 1.03
INSERT INTO goal_skills (goal_id, skill_id, display_order)
SELECT g.id, s.skill_id, s.display_order
FROM goals g
CROSS JOIN (VALUES
  ('1.01', 0),
  ('1.02', 1),
  ('1.03', 2)
) AS s(skill_id, display_order)
WHERE g.slug = 'improve';

-- reference: 1.05, 1.06, 1.07, 1.08, 1.09
INSERT INTO goal_skills (goal_id, skill_id, display_order)
SELECT g.id, s.skill_id, s.display_order
FROM goals g
CROSS JOIN (VALUES
  ('1.05', 0),
  ('1.06', 1),
  ('1.07', 2),
  ('1.08', 3),
  ('1.09', 4)
) AS s(skill_id, display_order)
WHERE g.slug = 'reference';
