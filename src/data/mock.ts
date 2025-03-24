import type { OrderItemColor, OrderProduct, OrderStep } from './types';

export const STEPS: OrderStep[] = [
  {
    id: 0,
    name: 'Погодження дизайну',
    description: '',
    max_duration_days: 5,
  },
  {
    id: 1,
    name: 'Підготовка таблиці замовлення',
    description: 'This is the second step',
    max_duration_days: 2,
  },
  {
    id: 2,
    name: 'Розробка лекал',
    description: 'This is the third step',
  },
  {
    id: 3,
    name: 'Розкладка',
    description: 'This is the 4 step',
    max_duration_days: 3,
  },
  {
    id: 4,
    name: 'Друк',
    description: 'This is the 5 step',
    max_duration_days: 9,
  },
  {
    id: 5,
    name: 'Підготовка до пошиття',
    description: 'This is the 6 step',
    max_duration_days: 3,
  },
  {
    id: 6,
    name: 'Пошиття',
    description: 'This is the 7 step',
    max_duration_days: 14,
  },
];

export const defaultColor: OrderItemColor = {
  color: '',
  amount_woman: 0,
  amount_man: 0,
  amount_kids: 0,
};

export const defaultItem: OrderProduct = {
  item_name: '',
  item_model: '',
  item_colors: [{ ...defaultColor }],
  item_total_amount: 0,
  item_order_link: '',
  item_manufacture: '',
  item_step_history: [],
};
