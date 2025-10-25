export interface Transaction {
  transactionId: number;
  amount: number;
  description?: string;
  date: Date;
  type?: string;
  medium?: string;
}
