export type UserRole = 'admin' | 'editor' | 'viewer';
export type ActivityStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface Profile {
  id: string;
  full_name: string;
  email?: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
}

export interface Committee {
  id: string;
  name: string;
  description?: string;
  color: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  committee_members?: CommitteeMember[];
}

export interface CommitteeMember {
  user_id: string;
  profiles?: Pick<Profile, 'id' | 'full_name' | 'avatar_url'>;
}

export interface Activity {
  id: string;
  name: string;
  description?: string;
  location?: string;
  start_date: string;
  end_date?: string;
  status: ActivityStatus;
  approval_status: ApprovalStatus;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  activity_committees?: ActivityCommittee[];
  profiles?: Pick<Profile, 'id' | 'full_name'>;
}

export interface ActivityCommittee {
  committee_id: string;
  committees?: Pick<Committee, 'id' | 'name' | 'color'>;
}

export interface ActivityAttendee {
  id: string;
  activity_id: string;
  full_name: string;
  phone?: string;
  user_id?: string;
  attended: boolean;
  registered_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ApiError {
  error: string;
}
