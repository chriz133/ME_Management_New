export interface Contract {
  contractId: number;
  createdAt: Date;
  accepted: boolean;
  customerId: number;
  customer?: Customer;
  positions?: ContractPosition[];
}

export interface ContractPosition {
  contractPositionId: number;
  amount: number;
  positionId: number;
  position?: Position;
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
