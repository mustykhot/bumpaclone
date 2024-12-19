export interface IEntry {
  id: number;
  campaign_id: number;
  customer_name: string;
  customer_id: number;
  customer_group_id: string;
  status: string;
  recipient: string;
  reference: null;
  processed: number;
  processed_at: any;
  created_at: string;
  updated_at: string;
  group: string;
}

export interface IEntries {
  per_page: number;
  to: number;
  total: number;
  last_page: number;
  data: IEntry[];
}
export interface ICampaign {
  name: string;
  type: string;
  status?: string;
  recipients: string[];
  subject: string;
  content: string;
  banner: null | string;
  created_at?: string;
  from_name?: string;
  from_email?: string | null;
  id?: string;
  entries?: IEntries;
  unsuccessful?: number;
  sent?: number;
  recipients_count?: number;
  waiting?: number;
}
