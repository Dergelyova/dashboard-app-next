export interface OrderItemColor {
  color: string;
  amount_kids: number;
  amount_woman: number;
  amount_man: number;
  amount_total?: number;
}

export interface OrderProduct {
  id?: number;
  item_name: string;
  item_model: string;
  item_image?: string;
  item_colors: OrderItemColor[];
  item_total_amount: number;
  item_order_link: string;
  item_manufacture: string;
  item_step_history: StepHistory[];
}

export interface Order {
  id?: number;
  client_name: string;
  client_contact_number: string;
  client_email?: string;
  comment?: string;
  date_of_order: string;
  order_type: string;
  order_status?: string;
  order_items: OrderProduct[];
}

export interface OrderStep {
  id: number;
  name: string;
  description?: string;
  max_duration_days?: number;
}

export interface StepHistory {
  step_id: number;
  date_started: string;
  date_ended: string;
}
