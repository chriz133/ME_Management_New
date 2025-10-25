export interface Invoice {
  invoiceId: number;
  createdAt: Date;
  customerId: number;
  startedAt: Date;
  finishedAt: Date;
  depositAmount: number;
  depositPaidOn: Date;
  type?: string;
  customer?: Customer;
  positions?: InvoicePosition[];
  totalAmount: number;
}

export interface InvoicePosition {
  invoicePositionId: number;
  amount: number;
  positionId: number;
  position?: Position;
  lineTotal: number;
}

export interface Position {
  positionId: number;
  text?: string;
  price: number;
  unit?: string;
}

export interface Customer {
  customerId: number;
  firstname?: string;
  surname?: string;
  fullName: string;
  plz?: number;
  city?: string;
  address?: string;
  nr?: number;
  uid?: string;
}
