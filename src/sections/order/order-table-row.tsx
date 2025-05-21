import React from 'react';
import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { TableRow } from '@mui/material';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuList from '@mui/material/MenuList';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { RouterLink } from 'src/routes/components';

import { fDate, fToNowDays } from 'src/utils/format-time';

import { Order } from 'src/data/types';
import { ORDER_STATUS_OPTIONS } from 'src/_mock';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';

import { getInitialActiveStep } from './item-details';
import { StepColorChip } from './order-details-item-status-label';

// -------------------------------------------------------
// ---------------
interface OrderTableRowProps {
  row: Order;
  selected: boolean;
  isEven: boolean;
  expandAll: boolean;
  // onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  detailsHref: string;
}
export function OrderTableRow({
  row,
  selected,
  isEven,
  expandAll,
  onDeleteRow,
  detailsHref,
}: OrderTableRowProps) {
  const confirmDialog = useBoolean();
  const menuActions = usePopover();
  const collapseRow = useBoolean();

  // Update collapse state when expandAll changes
  React.useEffect(() => {
    collapseRow.setValue(expandAll);
  }, [expandAll]);

  const handleToggle = () => {
    collapseRow.setValue(!collapseRow.value);
  };

  const renderPrimaryRow = () => (
    <TableRow
      hover
      selected={selected}
      sx={{
        borderBottom: '1px dashed',
        borderColor: 'text.secondary',
        ...(collapseRow.value && {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }),
      }}
    >
      <TableCell>
        <Link component={RouterLink} href={detailsHref} color="inherit" underline="always">
          #{row.id}
        </Link>
      </TableCell>

      <TableCell>
        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
          {/* <Avatar alt={row.clientName} src={row.customer.avatarUrl} /> */}

          <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
            <Box component="span">{row.clientName}</Box>

            <Box component="span" sx={{ color: 'text.disabled' }}>
              {row.clientContactNumber}
            </Box>
          </Stack>
        </Box>
      </TableCell>

      <TableCell>
        <ListItemText
          primary={fDate(row.dateOfOrder)}
          slotProps={{
            primary: {
              noWrap: true,
              sx: { typography: 'body2' },
            },
          }}
        />
      </TableCell>
      <TableCell align="center">
        <ListItemText
          primary={fToNowDays(row.dateOfOrder)}
          slotProps={{
            primary: {
              noWrap: true,
              sx: { typography: 'body2' },
            },
          }}
        />
      </TableCell>

      <TableCell align="center"> {row.orderItems.length} </TableCell>

      <TableCell>
        <Label
          variant="soft"
          //@ts-ignore
          color={
            (row.orderStatus === 'completed' && 'success') ||
            (row.orderStatus === 'pending' && 'warning') ||
            'default'
          }
        >
          {ORDER_STATUS_OPTIONS.find((option) => option.value === row.orderStatus)?.label ||
            'в процесі'}
        </Label>
        {/* <Label variant="soft" color={'warning'}>
          {'в процесі'}
        </Label> */}
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton
          color={collapseRow.value ? 'inherit' : 'default'}
          onClick={handleToggle}
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
    <TableRow sx={{ bgcolor: 'background.neutral' }}>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
        <Collapse
          in={collapseRow.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: 'transparent' }}
        >
          <Paper sx={{ m: 1.5 }}>
            {row.orderItems.map((item) => (
              <Box
                key={item.id}
                sx={(theme) => ({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: theme.spacing(1.5, 2, 1.5, 1.5),
                  '&:not(:last-of-type)': {
                    borderBottom: `solid 2px ${theme.palette.background.default}`,
                  },
                })}
              >
                <Stack
                  direction="row"
                  spacing={4}
                  sx={(theme) => ({
                    alignItems: 'center',
                  })}
                >
                  {!!item.itemImage && (
                    <Avatar
                      // src={item.coverUrl}
                      src="/assets/images/mock/m-product/product-2.webp"
                      variant="rounded"
                      sx={{ width: 48, height: 48, mr: 2 }}
                    />
                  )}
                  <ListItemText
                    primary={item.itemName}
                    secondary={item.itemModel}
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
                    primary={item.itemManufacture}
                    secondary="Виробництво"
                    slotProps={{
                      primary: {
                        sx: { typography: 'body2' },
                      },
                      secondary: {
                        sx: { color: 'text.disabled' },
                      },
                    }}
                  />
                </Stack>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  <StepColorChip stepNumber={getInitialActiveStep(item.itemStepHistory)} />
                </Stack>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  {/* calculate total amount */}
                  <div>
                    x{' '}
                    {item.itemColors.reduce(
                      (acc, color) =>
                        acc +
                        (color.amountTotal ||
                          color.amountKids + color.amountMan + color.amountWoman),
                      0
                    )}{' '}
                  </div>
                </Stack>
              </Box>
            ))}
          </Paper>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  // const renderSecondaryRow = () => (
  //   <TableRow>
  //     <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
  //       <Collapse
  //         in={collapseRow.value}
  //         timeout="auto"
  //         unmountOnExit
  //         sx={{ bgcolor: 'background.neutral' }}
  //       >
  //         <Paper sx={{ m: 1.5, p: 2 }}>
  //           <Box
  //             sx={{
  //               display: 'grid',
  //               gridTemplateColumns: '48px 2fr 1fr 2fr 80px', // Define fixed widths per column
  //               gap: 2,
  //               alignItems: 'center',
  //             }}
  //           >
  //             {row.orderItems.map((item) => (
  //               <React.Fragment key={item.id}>
  //                 {!!item.itemImage && (
  //                   <Avatar
  //                     src={`/assets/images/mock/m-product/product-2.webp`}
  //                     variant="rounded"
  //                     sx={{ width: 48, height: 48 }}
  //                   />
  //                 )}

  //                 <ListItemText
  //                   primary={item.itemName}
  //                   secondary={item.itemModel}
  //                   slotProps={{
  //                     primary: { sx: { typography: 'body2' } },
  //                     secondary: { sx: { mt: 0.5, color: 'text.disabled' } },
  //                   }}
  //                 />

  //                 <ListItemText
  //                   primary={item.itemManufacture}
  //                   secondary={'Виробництво'}
  //                   slotProps={{
  //                     primary: { sx: { typography: 'body2' } },
  //                     secondary: { sx: { color: 'text.disabled' } },
  //                   }}
  //                 />

  //                 <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
  //                   {item.itemColors.map((color, index) => (
  //                     <ListItemText
  //                       key={index}
  //                       primary={color.color}
  //                       secondary={`Ж.${color.amountWoman}| Ч.${color.amountMan}| Д.${color.amountKids}`}
  //                       slotProps={{
  //                         primary: { sx: { typography: 'body2' } },
  //                         secondary: { sx: { mt: 0.5, color: 'text.disabled' } },
  //                       }}
  //                     />
  //                   ))}
  //                 </Box>

  //                 <Box sx={{ textAlign: 'right', fontWeight: 'bold' }}>
  //                   x{' '}
  //                   {item.itemColors.reduce(
  //                     (acc, color) =>
  //                       acc +
  //                       (color.amountTotal ||
  //                         color.amountKids + color.amountMan + color.amountWoman),
  //                     0
  //                   )}
  //                 </Box>
  //               </React.Fragment>
  //             ))}
  //           </Box>
  //         </Paper>
  //       </Collapse>
  //     </TableCell>
  //   </TableRow>
  // );

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <li>
          <MenuItem component={RouterLink} href={detailsHref} onClick={() => menuActions.onClose()}>
            <Iconify icon="solar:eye-bold" />
            Перегляд
          </MenuItem>
        </li>
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
