'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  TextField,
  Divider,
  Typography,
  Stack,
  IconButton,
  Backdrop,
  CircularProgress,
  Card,
  CardHeader,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import type { Order, OrderItemColor, OrderProduct } from 'src/data/types';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { createOrder } from 'src/data/api';
import { formatPatterns } from 'src/utils/format-time';
import { defaultColor, defaultItem } from 'src/data/mock';

const AddColorsForm = ({
  colorInfo,
  changeColorData,
  removeColor,
  isRemovable,
}: {
  colorInfo: OrderItemColor;
  changeColorData: (value: OrderItemColor) => void;
  removeColor: () => void;
  isRemovable: boolean;
}) => {
  return (
    <Box
      sx={{
        padding: 2,
        marginBottom: 2,
        borderRadius: '20px',
        border: '1px solid #F4F6F8',
        position: 'relative',
        boxShadow: '0 0 2px 0 rgba(145 158 171 / 0.2),0 12px 24px -4px rgba(145 158 171 / 0.12)',
      }}
    >
      <TextField
        fullWidth
        label="Колір виробу"
        value={colorInfo.color}
        onChange={(e) => changeColorData({ ...colorInfo, color: e.target.value })}
        sx={{ mb: 2, mt: 1 }}
      />
      <Stack spacing={2}>
        <Typography>Кількість</Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            label="Жін"
            value={colorInfo.amount_woman}
            onChange={(e) =>
              changeColorData({
                ...colorInfo,
                amount_woman: isNaN(+e.target.value) ? 0 : +e.target.value,
              })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Чол"
            value={colorInfo.amount_man}
            onChange={(e) =>
              changeColorData({
                ...colorInfo,
                amount_man: isNaN(+e.target.value) ? 0 : +e.target.value,
              })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Дит"
            value={colorInfo.amount_kids}
            onChange={(e) =>
              changeColorData({
                ...colorInfo,
                amount_kids: isNaN(+e.target.value) ? 0 : +e.target.value,
              })
            }
            sx={{ mb: 2 }}
          />
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Typography>{`Всього: ${
            colorInfo.amount_kids + colorInfo.amount_man + colorInfo.amount_woman
          } шт.`}</Typography>
          {isRemovable && (
            <Button onClick={removeColor} color="error" sx={{ padding: 0, margin: 0 }}>
              видалити колір
            </Button>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

const AddOrderItemForm = ({
  order,
  item,
  handleUpdate,
  handleColorAdd,
  handleColorRemove,
  handleItemRemove,
  isRemovable,
}: {
  order: number;
  item: OrderProduct;
  handleUpdate: (newValue: OrderProduct) => void;
  handleColorAdd: () => void;
  handleColorRemove: (colorIndex: number) => void;
  handleItemRemove: () => void;
  isRemovable: boolean;
}) => {
  return (
    <Card sx={{ marginBlock: 2 }}>
      {isRemovable && (
        <IconButton
          color={'error'}
          sx={{ position: 'absolute', top: 2, right: 2, borderRadius: '100%' }}
          onClick={handleItemRemove}
        >
          <RemoveCircleOutlineIcon />
        </IconButton>
      )}

      <CardHeader title={`Виріб #${order}`} sx={{ mb: 3 }} />
      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack direction={'row'} spacing={2}>
          <TextField
            fullWidth
            label="Найменування виробу"
            value={item.item_name}
            onChange={(e) =>
              handleUpdate({
                ...item,
                item_name: e.target.value,
              })
            }
          />
          <TextField
            fullWidth
            label="Модель виробу"
            value={item.item_model}
            onChange={(e) =>
              handleUpdate({
                ...item,
                item_model: e.target.value,
              })
            }
          />
        </Stack>
        <TextField
          fullWidth
          label="Посилання на замовлення"
          value={item.item_order_link}
          onChange={(e) =>
            handleUpdate({
              ...item,
              item_order_link: e.target.value,
            })
          }
        />
        <TextField
          fullWidth
          label="Виробництво"
          value={item.item_manufacture}
          onChange={(e) =>
            handleUpdate({
              ...item,
              item_manufacture: e.target.value,
            })
          }
        />
        <Typography variant="body2" sx={{ textTransform: 'uppercase', fontWeight: '600' }}>
          Кольори
        </Typography>
        {item.item_colors.map((color, colorIndex) => (
          <AddColorsForm
            key={colorIndex}
            colorInfo={color}
            changeColorData={(value) => {
              const updatedColors = item.item_colors.map((c, i) => {
                if (i === colorIndex) {
                  return value;
                }
                return c;
              });
              handleUpdate({
                ...item,
                item_colors: updatedColors,
              });
            }}
            removeColor={() => handleColorRemove(colorIndex)}
            isRemovable={item.item_colors.length > 1}
          />
        ))}

        <Button variant="outlined" onClick={() => handleColorAdd()} startIcon={<AddIcon />}>
          Додати колір
        </Button>
      </Stack>
    </Card>
  );
};

//main order form
interface OrderFormProps {
  initialData: Order;
  onSubmit: (order) => void;
}
export default function OrderForm({ initialData, onSubmit }: OrderFormProps) {
  const [saving, setSaving] = useState(false);

  const [orderCoreData, setOrderCoreData] = useState<Partial<Order>>(initialData);

  const [orderItems, setOrderItems] = useState(initialData.order_items);

  const handleSave = () => {
    setSaving(true);
    const updatedOrder: Order = {
      ...orderCoreData,
      order_items: orderItems.map((item) =>
        item.item_step_history.length === 0
          ? {
              ...item,
              item_step_history: [
                {
                  step_id: 0,
                  date_started: orderCoreData.date_of_order,
                },
              ],
            }
          : { ...item }
      ),
    } as Order;
    onSubmit(updatedOrder);
    setSaving(false);
  };

  const handleItemAdd = () => {
    setOrderItems([...orderItems, { ...defaultItem }]);
  };

  const handleItemUpdate = (index: number, newData: OrderProduct) => {
    const updatedItems = orderItems.map((item, i) => {
      if (i === index) {
        return newData;
      }
      return item;
    });
    setOrderItems(updatedItems);
  };

  const handleItemRemove = (index: number) => {
    if (orderItems.length > 1) {
      const updatedItems = [...orderItems];
      updatedItems.splice(index, 1);
      setOrderItems(updatedItems);
    }
  };

  const handleColorAdd = (index: number) => {
    handleItemUpdate(index, {
      ...orderItems[index],
      item_colors: [...orderItems[index].item_colors, { ...defaultColor }],
    });
  };

  const handleColorRemove = (indexOfItem: number, indexOfColor: number) => {
    const copiedItemColors = [...orderItems[indexOfItem].item_colors];
    copiedItemColors.splice(indexOfColor, 1);
    handleItemUpdate(indexOfItem, {
      ...orderItems[indexOfItem],
      item_colors: [...copiedItemColors],
    });
  };

  return (
    <Box p={3} sx={{ maxWidth: '720px', marginInline: 'auto' }}>
      <Card>
        <CardHeader title="Дані клієнта" sx={{ mb: 3 }} />
        <Divider />
        <Stack spacing={3} sx={{ p: 3 }}>
          <Box>
            <TextField
              fullWidth
              label="Найменування клієнта"
              value={orderCoreData.client_name}
              onChange={(e) =>
                setOrderCoreData({
                  ...orderCoreData,
                  client_name: e.target.value,
                })
              }
              sx={{ mb: 2 }}
            />
            <Stack direction={'row'} spacing={2} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Контактний номер"
                value={orderCoreData.client_contact_number}
                onChange={(e) =>
                  setOrderCoreData({
                    ...orderCoreData,
                    client_contact_number: e.target.value,
                  })
                }
              />
              <DatePicker
                label="Дата замовлення"
                value={dayjs(orderCoreData.date_of_order)}
                format={formatPatterns.paramCase.date}
                onChange={(e) =>
                  setOrderCoreData({
                    ...orderCoreData,
                    date_of_order: dayjs(e).format(formatPatterns.date),
                  })
                }
              />
            </Stack>
            <TextField
              fullWidth
              label="Тип замовлення"
              value={orderCoreData.order_type}
              onChange={(e) =>
                setOrderCoreData({
                  ...orderCoreData,
                  order_type: e.target.value,
                })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Коментар до клієнта/замовлення"
              multiline
              rows={4}
              value={orderCoreData.comment}
              onChange={(e) => setOrderCoreData({ ...orderCoreData, comment: e.target.value })}
            />
          </Box>
        </Stack>
      </Card>
      <Divider sx={{ marginBlock: 2 }} />
      <Box mt={2}>
        <Typography variant="h6" textTransform={'uppercase'}>
          Деталі замовлення
        </Typography>
      </Box>

      {orderItems.map((item, index) => (
        <AddOrderItemForm
          key={index}
          order={index + 1}
          item={item}
          handleUpdate={(value) => handleItemUpdate(index, value)}
          handleColorAdd={() => handleColorAdd(index)}
          handleColorRemove={(colorIndex) => handleColorRemove(index, colorIndex)}
          handleItemRemove={() => handleItemRemove(index)}
          isRemovable={orderItems.length > 1}
        />
      ))}

      <Button
        variant="outlined"
        onClick={() => handleItemAdd()}
        sx={{ mt: 2 }}
        startIcon={<AddIcon />}
      >
        Додати виріб
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button variant="contained" onClick={handleSave}>
          Зберегти замовлення
        </Button>
      </Box>

      {/* Loader Overlay */}
      <Backdrop open={saving} sx={{ color: '#fff', zIndex: 9999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}
