export type WalletDetailsType = {
    account_name: string;
    account_number: string;
    bank_name: string;
    is_active: string;
    transaction_limit: string;
    tier: string;
    balance: number;
    max_transaction_limit: number;
}

export type WalletCustomerType = {
    firstName: string;
    lastName: string;
    name: string;
}

export type WalletTransactionDetailsType = {
    amount: string;
    customer: WalletCustomerType;
    id: string;
    settled_at: string;
    transaction_date: string;
    channel: string;
}
 
export type BankDetails = {
    id: number
    code: string
    name: string
    isMobileVerified: null,
    branches?: null
}