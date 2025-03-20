import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuList from '@mui/material/MenuList';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import { TableRow } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';
import { Order } from 'src/data/types';
import { CONFIG } from 'src/global-config';

// -------------------------------------------------------
// ---------------
interface OrderTableRowProps {
  row: Order;
  selected: boolean;
  // onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  detailsHref: string;
}
export function OrderTableRow({
  row,
  selected,

  onDeleteRow,
  detailsHref,
}: OrderTableRowProps) {
  const confirmDialog = useBoolean();
  const menuActions = usePopover();
  const collapseRow = useBoolean();

  const renderPrimaryRow = () => (
    <TableRow hover selected={selected}>
      {/* <TableCell padding="checkbox">
        <Checkbox
          checked={selected}
          onClick={onSelectRow}
          inputProps={{
            id: `${row.id}-checkbox`,
            'aria-label': `${row.id} checkbox`,
          }}
        />
      </TableCell> */}

      <TableCell>
        <Link component={RouterLink} href={detailsHref} color="inherit" underline="always">
          #{row.id}
        </Link>
      </TableCell>

      <TableCell>
        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
          {/* <Avatar alt={row.client_name} src={row.customer.avatarUrl} /> */}

          <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
            <Box component="span">{row.client_name}</Box>

            <Box component="span" sx={{ color: 'text.disabled' }}>
              {row.client_contact_number}
            </Box>
          </Stack>
        </Box>
      </TableCell>

      <TableCell>
        <ListItemText
          primary={fDate(row.date_of_order)}
          secondary={fTime(row.date_of_order)}
          slotProps={{
            primary: {
              noWrap: true,
              sx: { typography: 'body2' },
            },
            secondary: {
              sx: { mt: 0.5, typography: 'caption' },
            },
          }}
        />
      </TableCell>

      <TableCell align="center"> {row.order_items.length} </TableCell>

      {/* <TableCell> {fCurrency(row.subtotal)} </TableCell> */}

      <TableCell>
        {/* <Label
          variant="soft"
          color={
            (row.status === 'completed' && 'success') ||
            (row.status === 'pending' && 'warning') ||
            (row.status === 'cancelled' && 'error') ||
            'default'
          }
        >
          {row.status}
        </Label> */}
        <Label variant="soft" color={'warning'}>
          {'в процесі'}
        </Label>
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton
          color={collapseRow.value ? 'inherit' : 'default'}
          onClick={collapseRow.onToggle}
          sx={{ ...(collapseRow.value && { bgcolor: 'action.hover' }) }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton>

        <IconButton color={menuActions.open ? 'inherit' : 'default'} onClick={menuActions.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  const renderSecondaryRow = () => (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
        <Collapse
          in={collapseRow.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: 'background.neutral' }}
        >
          <Paper sx={{ m: 1.5 }}>
            {row.order_items.map((item) => (
              <Box
                key={item.id}
                sx={(theme) => ({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: theme.spacing(1.5, 2, 1.5, 1.5),
                  '&:not(:last-of-type)': {
                    borderBottom: `solid 2px ${theme.vars.palette.background.neutral}`,
                  },
                })}
              >
                <Avatar
                  // src={item.coverUrl}
                  src={`/assets/images/mock/m-product/product-2.webp`}
                  variant="rounded"
                  sx={{ width: 48, height: 48, mr: 2 }}
                />

                <ListItemText
                  primary={item.item_name}
                  secondary={item.item_model}
                  slotProps={{
                    primary: {
                      sx: { typography: 'body2' },
                    },
                    secondary: {
                      sx: { mt: 0.5, color: 'text.disabled' },
                    },
                  }}
                />
                <ListItemText
                  primary={item.item_manufacture}
                  secondary={'Виробництво'}
                  slotProps={{
                    primary: {
                      sx: { typography: 'body2' },
                    },
                    secondary: {
                      sx: { color: 'text.disabled' },
                    },
                  }}
                />
                <Stack direction={'row'} spacing={2}>
                  {item.item_colors.map((color) => (
                    <ListItemText
                      primary={color.color}
                      secondary={`Ж.${color.amount_woman}| Ч.${color.amount_man}| Д.${color.amount_kids}`}
                      slotProps={{
                        primary: {
                          sx: { typography: 'body2' },
                        },
                        secondary: {
                          sx: { mt: 0.5, color: 'text.disabled' },
                        },
                      }}
                    />
                  ))}
                </Stack>

                <div>x{item.item_total_amount} </div>

                {/* <Box sx={{ width: 110, textAlign: 'right' }}>{fCurrency(item.price)}</Box> */}
              </Box>
            ))}
          </Paper>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <MenuItem
          onClick={() => {
            confirmDialog.onTrue();
            menuActions.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Видалити
        </MenuItem>

        <li>
          <MenuItem component={RouterLink} href={detailsHref} onClick={() => menuActions.onClose()}>
            <Iconify icon="solar:eye-bold" />
            Перегляд
          </MenuItem>
        </li>
      </MenuList>
    </CustomPopover>
  );

  const renderConfrimDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Видалення"
      content={`Ви впевнені що бажаєте видалити замовлення #${row.id}`}
      action={
        <Button variant="contained" color="error" onClick={onDeleteRow}>
          Видалити
        </Button>
      }
    />
  );

  return (
    <>
      {renderPrimaryRow()}
      {renderSecondaryRow()}
      {renderMenuActions()}
      {renderConfrimDialog()}
    </>
  );
}
