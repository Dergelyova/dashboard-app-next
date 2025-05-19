export interface OrderItemColor {
  color: string;
  amountKids: number;
  amountWoman: number;
  amountMan: number;
  amountTotal?: number;
}

export interface OrderProduct {
  id?: number;
  itemName: string;
  itemModel: string;
  itemImage?: string;
  itemColors: OrderItemColor[];
  itemTotalAmount: number;
  itemOrderLink: string;
  itemManufacture: string;
  itemStepHistory: StepHistory[];
}

export interface Order {
  id?: number;
  clientName: string;
  clientContactNumber: string;
  clientEmail?: string;
  comment?: string;
  dateOfOrder: string; //'dd.mm.yyyy hh:mm:zz'
  orderType: string;
  orderStatus?: 'pending' | 'completed';
  orderItems: OrderProduct[];
}

export interface OrderStep {
  id: number;
  name: string;
  description?: string;
  maxDurationDays?: number;
}

export interface StepHistory {
  stepId: number;
  dateStarted: string;
  dateEnded: string;
}
