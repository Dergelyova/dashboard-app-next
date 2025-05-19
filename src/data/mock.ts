import type { OrderItemColor, OrderProduct, OrderStep } from './types';

export const STEPS: OrderStep[] = [
  {
    id: 0,
    name: 'Погодження дизайну',
    description: '',
    maxDurationDays: 5,
  },
  {
    id: 1,
    name: 'Підготовка таблиці замовлення',
    description: 'This is the second step',
    maxDurationDays: 2,
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
    maxDurationDays: 3,
  },
  {
    id: 4,
    name: 'Друк',
    description: 'This is the 5 step',
    maxDurationDays: 9,
  },
  {
    id: 5,
    name: 'Підготовка до пошиття',
    description: 'This is the 6 step',
    maxDurationDays: 3,
  },
  {
    id: 6,
    name: 'Пошиття',
    description: 'This is the 7 step',
    maxDurationDays: 14,
  },
];

export const defaultColor: OrderItemColor = {
  color: '',
  amountWoman: 0,
  amountMan: 0,
  amountKids: 0,
};

export const defaultItem: OrderProduct = {
  itemName: '',
  itemModel: '',
  itemColors: [{ ...defaultColor }],
  itemTotalAmount: 0,
  itemOrderLink: '',
  itemManufacture: '',
  itemStepHistory: [],
};
