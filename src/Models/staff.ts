type IStaffSlot = {
  available_staff_slots: number;
  default_slots: number;
  used_staff_slots: number;
  disabled_slots: number;
  extra_staff_slots: number;
};

export interface IStaff {
  created_at: string;
  name: string;
  role: string;
  order_count: number;
  id: string;
  email?: string;
  last_seen?: string | null;
  status?: "PENDING" | "ACCEPTED";
  is_disabled?: boolean;
  slots: IStaffSlot;
}

export interface IGetStaffAccountsResponse {
  success: boolean;
  slots: IStaffSlot;
  staff: IStaff[];
}

export interface IStaffDetails {
  name: string;
  email: string;
  phone: string;
}

export interface ICreateStaffPayload {
  staff: IStaffDetails[];
  role: string;
  permissions: any;
}

export interface IUpdateStaffPayload {
  name: string;
  role: string;
  email: string;
  phone: string;
  permissions: any;
}
