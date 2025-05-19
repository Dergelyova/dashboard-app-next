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
import { DatePicker, DateTimePicker, DesktopDateTimePicker } from '@mui/x-date-pickers';
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
            value={colorInfo.amountWoman}
            onChange={(e) =>
              changeColorData({
                ...colorInfo,
                amountWoman: isNaN(+e.target.value) ? 0 : +e.target.value,
              })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Чол"
            value={colorInfo.amountMan}
            onChange={(e) =>
              changeColorData({
                ...colorInfo,
                amountMan: isNaN(+e.target.value) ? 0 : +e.target.value,
              })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Дит"
            value={colorInfo.amountKids}
            onChange={(e) =>
              changeColorData({
                ...colorInfo,
                amountKids: isNaN(+e.target.value) ? 0 : +e.target.value,
              })
            }
            sx={{ mb: 2 }}
          />
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Typography>{`Всього: ${
            colorInfo.amountKids + colorInfo.amountMan + colorInfo.amountWoman
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
            value={item.itemName}
            onChange={(e) =>
              handleUpdate({
                ...item,
                itemName: e.target.value,
              })
            }
          />
          <TextField
            fullWidth
            label="Модель виробу"
            value={item.itemModel}
            onChange={(e) =>
              handleUpdate({
                ...item,
                itemModel: e.target.value,
              })
            }
          />
        </Stack>
        <TextField
          fullWidth
          label="Посилання на замовлення"
          value={item.itemOrderLink}
          onChange={(e) =>
            handleUpdate({
              ...item,
              itemOrderLink: e.target.value,
            })
          }
        />
        <TextField
          fullWidth
          label="Виробництво"
          value={item.itemManufacture}
          onChange={(e) =>
            handleUpdate({
              ...item,
              itemManufacture: e.target.value,
            })
          }
        />
        <Typography variant="body2" sx={{ textTransform: 'uppercase', fontWeight: '600' }}>
          Кольори
        </Typography>
        {item.itemColors.map((color, colorIndex) => (
          <AddColorsForm
            key={colorIndex}
            colorInfo={color}
            changeColorData={(value) => {
              const updatedColors = item.itemColors.map((c, i) => {
                if (i === colorIndex) {
                  return value;
                }
                return c;
              });
              handleUpdate({
                ...item,
                itemColors: updatedColors,
              });
            }}
            removeColor={() => handleColorRemove(colorIndex)}
            isRemovable={item.itemColors.length > 1}
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

  const [orderItems, setOrderItems] = useState(initialData.orderItems);

  const handleSave = () => {
    setSaving(true);
    const updatedOrder: Order = {
      ...orderCoreData,
      orderItems: orderItems.map((item) =>
        item.itemStepHistory.length === 0
          ? {
              ...item,
              itemStepHistory: [
                {
                  stepId: 0,
                  dateStarted: orderCoreData.dateOfOrder,
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
      itemColors: [...orderItems[index].itemColors, { ...defaultColor }],
    });
  };

  const handleColorRemove = (indexOfItem: number, indexOfColor: number) => {
    const copiedItemColors = [...orderItems[indexOfItem].itemColors];
    copiedItemColors.splice(indexOfColor, 1);
    handleItemUpdate(indexOfItem, {
      ...orderItems[indexOfItem],
      itemColors: [...copiedItemColors],
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
              value={orderCoreData.clientName}
              onChange={(e) =>
                setOrderCoreData({
                  ...orderCoreData,
                  clientName: e.target.value,
                })
              }
              sx={{ mb: 2 }}
            />
            <Stack direction={'row'} spacing={2} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Контактний номер"
                value={orderCoreData.clientContactNumber}
                onChange={(e) =>
                  setOrderCoreData({
                    ...orderCoreData,
                    clientContactNumber: e.target.value,
                  })
                }
              />
              <DateTimePicker
                ampm={false}
                localeText={{ toolbarTitle: 'Оберіть час і дату' }}
                label="Дата замовлення"
                value={dayjs(orderCoreData.dateOfOrder, formatPatterns.dateTime)}
                format={formatPatterns.dateTime}
                onChange={(e) =>
                  setOrderCoreData({
                    ...orderCoreData,
                    dateOfOrder: dayjs(e).format(formatPatterns.dateTime),
                  })
                }
              />
            </Stack>
            <TextField
              fullWidth
              label="Тип замовлення"
              value={orderCoreData.orderType}
              onChange={(e) =>
                setOrderCoreData({
                  ...orderCoreData,
                  orderType: e.target.value,
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
