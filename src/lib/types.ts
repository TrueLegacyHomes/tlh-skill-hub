export type UserRole = 'admin' | 'department_head' | 'team_member' | 'engineering';

export type Department =
  | 'executive'
  | 'operations'
  | 'interior_design'
  | 'estate_sales'
  | 'home_acquisitions'
  | 'care_placement'
  | 'marketing'
  | 'engineering';

export type CardStatus =
  | 'submitted'
  | 'under_review'
  | 'changes_requested'
  | 'approved'
  | 'engineering_queued'
  | 'in_progress'
  | 'done'
  | 'archived';

export type CardType =
  | 'problem_definition'
  | 'sop'
  | 'new_product_plan'
  | 'system_change_request'
  | 'report_dashboard'
  | 'automation_plan'
  | 'template'
  | 'skill_improvement'
  | 'engineering_build'
  | 'other';

export type ImpactLevel = 'high' | 'medium' | 'low';
export type UrgencyLevel = 'blocking' | 'important' | 'nice_to_have';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  department: Department;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Card {
  id: string;
  board_id: string;
  column_id: string;
  title: string;
  description: string | null;
  card_type: CardType;
  status: CardStatus;
  position: number;
  created_by: string;
  assigned_to: string | null;
  department: Department;
  goal: string | null;
  skills_used: string[] | null;
  workflow_name: string | null;
  deliverable_summary: string | null;
  deliverable_url: string | null;
  priority: number;
  estimated_impact: ImpactLevel;
  time_saved_hours: number;
  urgency: UrgencyLevel;
  composite_score: number;
  current_approver_id: string | null;
  approved_by: string | null;
  approved_at: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface Column {
  id: string;
  board_id: string;
  name: string;
  status: CardStatus;
  position: number;
  wip_limit: number | null;
  color: string | null;
}

export interface Comment {
  id: string;
  card_id: string;
  author_id: string;
  body: string;
  is_system: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  recipient_id: string;
  card_id: string | null;
  type: string;
  title: string;
  body: string | null;
  is_read: boolean;
  created_at: string;
}

export interface ApprovalRule {
  id: string;
  name: string;
  description: string | null;
  match_card_type: CardType | null;
  match_department: Department | null;
  match_creator_role: UserRole | null;
  match_goal: string | null;
  route_to_role: UserRole | null;
  route_to_department: Department | null;
  route_to_user_id: string | null;
  next_status: CardStatus;
  auto_move_to_engineering: boolean;
  requires_approval: boolean;
  priority: number;
  is_active: boolean;
}
