export interface Offer {
  id: number;
  customerId: number;
  customerName: string;
  offerNumber: string;
  title: string;
  offerDate: Date;
  validUntil: Date;
  status: string;
  notes?: string;
  lineItems: OfferLineItem[];
  netTotal: number;
  taxTotal: number;
  grossTotal: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface OfferLineItem {
  id: number;
  offerId: number;
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

export interface OfferCreateUpdate {
  customerId: number;
  offerNumber: string;
  title: string;
  offerDate: Date;
  validUntil: Date;
  status: string;
  notes?: string;
  lineItems: OfferLineItemCreateUpdate[];
}

export interface OfferLineItemCreateUpdate {
  positionId?: number;
  lineNumber: number;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  taxRate: number;
}
