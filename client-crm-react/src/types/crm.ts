export type PipelineStage = 
  | 'PITCH_READY' 
  | 'PITCH_SENT' 
  | 'REPLIED' 
  | 'DEMO_SHARED' 
  | 'CALL_BOOKED' 
  | 'CLOSED_WON' 
  | 'LOST';

export interface Prospect {
  id: string;
  business: string;
  owner: string;
  phone: string;
  website: string;
  niche: string;
  location: string;
  weakness: string;
  stage: PipelineStage;
  has_replied: boolean;
  reply_notes?: string;
  notes?: string;
  last_contacted?: string;
  follow_up_date?: string;
  deal_value: number;
  pitch: string;
  date_added?: string;
  days_since_contact?: number | null;
  follow_up_message?: string;
}

export interface FollowUpBuckets {
  overdue: Prospect[];
  due_today: Prospect[];
  upcoming: Prospect[];
  recent: Prospect[];
  total_actionable: number;
}

export interface NicheCategoryStats {
  category: string;
  total: number;
  pitched: number;
  replied: number;
  in_discussion: number;
  closed_won: number;
  revenue: number;
  pipeline_value: number;
  reply_rate: number;
}

export interface FunnelSummary {
  total_pipeline_value: number;
  total_revenue: number;
  best_performing_niche: string | null;
  worst_performing_niche: string | null;
}

export interface AnalyticsResponse {
  categories: NicheCategoryStats[];
  funnel: FunnelSummary;
}

export interface DashboardMetrics {
  total: number;
  sent: number;
  sentPct: number;
  replied: number;
  replyRate: number;
  discussion: number;
  closedWon: number;
  revenue: number;
  pipelineValue: number;
}

