export interface IConversationsList {
  id: string;
  messages: any;
  participants: any;
  updated_time?: string;
}

export interface IMessagesList {
  id: string;
}

export interface ICustomerProfile {
  follower_count: number;
  id: string;
  is_business_follow_user: boolean;
  is_user_follow_business: false;
  is_verified_user: false;
  name: string;
  profile_pic: string;
}
