export interface Invoice {
  id: number;
  customerId: number;
  customerName: string;
  contractId?: number;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  status: string;
  notes?: string;
  lineItems: InvoiceLineItem[];
  netTotal: number;
  taxTotal: number;
  grossTotal: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface InvoiceLineItem {
  id: number;
  invoiceId: number;
  positionId?: number;
  lineNumber: number;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  taxRate: number;
  lineTotal: number;
  lineTax: number;
}

export interface InvoiceCreateUpdate {
  customerId: number;
  contractId?: number;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  status: string;
  notes?: string;
  lineItems: InvoiceLineItemCreateUpdate[];
}

export interface InvoiceLineItemCreateUpdate {
  positionId?: number;
  lineNumber: number;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  taxRate: number;
}
