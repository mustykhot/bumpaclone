export type ProfileType = "Traveler" | "Agent" | "Admin" | null;
export type AccountType = "Business" | "Personal";
export type ServiceStatus =
  | "OPEN"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELLED"
  | "DISPUTED"
  | "RELEASE";

export type AGENT_LEVEL =
  | "BEGINNER"
  | "INTERMEDIATE"
  | "ADVANCED"
  | "SUPER_AGENT";

export type GenericType = {
  _id: string;
  id?: string;
  publicId?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
};
export type AnyObject = { [key: string]: any };

export type UserType = {
  name: string;
  id: number;
};
export type UpdateStockType = {
  action: string;
  quantity?: number;
  variations?: { product_variation_id: number; quantity: number }[];
};
export type FileType = {
  name: string;
  url: string;
  mime_type: string;
};
export type DocumentType = {
  file: FileType;
  _id: string;
  createdAt: Date;
};

export type ServiceType = {
  images: DocumentType[];
  documents: DocumentType[];
  active: boolean;
  _id: string;
  user: UserType;
  name: string;
  description: string;
  country: string;
  amount: number;
  minDays: number;
  maxDays: number;
  discount: number;
  releaseClause: { description: string }[];
  requirements?: string;
  category: string;
  isVerified?: boolean;
  status?: string;
  currency: "NGN" | "USD";
  itemOnDiscount: string | number;
};

export type PaginationMeta = {
  totalPage?: number;
  current?: number;
  perPage?: number;
  totalCount?: number;
};

export type CategoryType = {
  name: string;
  id: string;
  createdAt: Date;
};

// export enum TransferStatus {
//   LOCKED = "locked",
//   PENDING = "pending",
//   COMPLETED = "completed",
//   REVERSED = "reversed",
//   FAILED = "failed",
// }
export type TransferStatus =
  | "locked"
  | "pending"
  | "completed"
  | "reversed"
  | "failed";
export type TransactionType = {
  id: string;
  amount: number;
  fee: number;
  email: string;
  narration: string;
  paidAt: Date;
  currency: "NGN" | "USD";
  type: "bank-transfer" | "wallet-transfer";
  status: TransferStatus;
  reference: string;
  visaService?: ServiceType;
  receiver: UserType;
  sender: UserType;
};
export type TransactionHistoryRes = {
  stats: {
    totalBalance: { amount: number };
    totalLocked: { amount: number };
  };
  transactions: TransactionType[];
};

export type NotificationType = {
  _id: string;
  publicId: string;
  user: string;
  title: string;
  type: string;
  status: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
};

export type FeatureType = {
  title: string;
  features: string[];
  starter: string[];
  pro: string[];
  growth: string[];
};

export type MobileFeatureType = {
  title: string;
  price: string;
  description: string;
  features: { name: string; description: string; list?: string[] }[];
};

export type PermissionsType = {
  orders: {
    view: boolean;
    manage: boolean;
  };
  messaging: {
    view: boolean;
    manage: boolean;
  };
  products: {
    view: boolean;
    manage: boolean;
  };
  analytics: {
    view: boolean;
  };
};
