// 'use client';

// import { useState, useCallback } from 'react';
// import { varAlpha } from 'minimal-shared/utils';
// import { useBoolean, useSetState } from 'minimal-shared/hooks';

// import Tab from '@mui/material/Tab';
// import Box from '@mui/material/Box';
// import Tabs from '@mui/material/Tabs';
// import Card from '@mui/material/Card';
// import Table from '@mui/material/Table';
// import Button from '@mui/material/Button';
// import TableBody from '@mui/material/TableBody';

// import { paths } from 'src/routes/paths';

// import { fIsAfter, fIsBetween } from 'src/utils/format-time';

// import { DashboardContent } from 'src/layouts/dashboard';

// import { Label } from 'src/components/label';
// import { toast } from 'src/components/snackbar';
// import { Scrollbar } from 'src/components/scrollbar';
// import { ConfirmDialog } from 'src/components/custom-dialog';
// import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// import { OrderTableRow } from '../order-table-row';
// import { OrderTableToolbar } from '../order-table-toolbar';
// import { OrderTableFiltersResult } from '../order-table-filters-result';

// // ----------------------------------------------------------------------

// ----------------------------------------------------------------------

// export function OrderListView() {
//   const table = useTable({ defaultOrderBy: 'orderNumber' });

//   const confirmDialog = useBoolean();

//   const [tableData, setTableData] = useState(_orders);

//   const filters = useSetState({
//     name: '',
//     status: 'all',
//   });
//   const { state: currentFilters, setState: updateFilters } = filters;

//   const dateError = fIsAfter(currentFilters.startDate, currentFilters.endDate);

//   const dataFiltered = applyFilter({
//     inputData: tableData,
//     comparator: getComparator(table.order, table.orderBy),
//     filters: currentFilters,
//     dateError,
//   });

//   const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

//   const canReset =
//     !!currentFilters.name ||
//     currentFilters.status !== 'all' ||
//     (!!currentFilters.startDate && !!currentFilters.endDate);

//   const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

// const handleDeleteRow = useCallback(
//   (id) => {
//     const deleteRow = tableData.filter((row) => row.id !== id);

//     toast.success('Delete success!');

//     setTableData(deleteRow);

//     table.onUpdatePageDeleteRow(dataInPage.length);
//   },
//   [dataInPage.length, table, tableData]
// );

//   const handleDeleteRows = useCallback(() => {
//     const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

//     toast.success('Delete success!');

//     setTableData(deleteRows);

//     table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);
//   }, [dataFiltered.length, dataInPage.length, table, tableData]);

//   const handleFilterStatus = useCallback(
//     (event, newValue) => {
//       table.onResetPage();
//       updateFilters({ status: newValue });
//     },
//     [updateFilters, table]
//   );

//   const renderConfirmDialog = () => (
//     <ConfirmDialog
//       open={confirmDialog.value}
//       onClose={confirmDialog.onFalse}
//       title="Delete"
//       content={
//         <>
//           Ви впевнені що хочете видалити <strong> {table.selected.length} </strong> замовлень?
//         </>
//       }
//       action={
//         <Button
//           variant="contained"
//           color="error"
//           onClick={() => {
//             handleDeleteRows();
//             confirmDialog.onFalse();
//           }}
//         >
//           Видалити
//         </Button>
//       }
//     />
//   );

//   return (
//     <>
//       <DashboardContent>
//         <CustomBreadcrumbs
//           heading="Список замовлень"
//           links={[
//             { name: 'Дашборд', href: paths.dashboard.root },
//             { name: 'Замовлення', href: paths.dashboard.order.root },
//             { name: 'Список' },
//           ]}
//           sx={{ mb: { xs: 3, md: 5 } }}
//         />

//         <Card>
//           <Tabs
//             value={currentFilters.status}
//             onChange={handleFilterStatus}
//             sx={[
//               (theme) => ({
//                 px: 2.5,
//                 boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
//               }),
//             ]}
//           >
//             {STATUS_OPTIONS.map((tab) => (
//               <Tab
//                 key={tab.value}
//                 iconPosition="end"
//                 value={tab.value}
//                 label={tab.label}
//                 icon={
//                   <Label
//                     variant={
//                       ((tab.value === 'all' || tab.value === currentFilters.status) && 'filled') ||
//                       'soft'
//                     }
//                     color={
//                       (tab.value === 'completed' && 'success') ||
//                       (tab.value === 'pending' && 'warning') ||
//                       (tab.value === 'cancelled' && 'error') ||
//                       'default'
//                     }
//                   >
//                     {['completed', 'pending', 'cancelled', 'refunded'].includes(tab.value)
//                       ? tableData.filter((user) => user.status === tab.value).length
//                       : tableData.length}
//                   </Label>
//                 }
//               />
//             ))}
//           </Tabs>

//           <OrderTableToolbar
//             filters={filters}
//             onResetPage={table.onResetPage}
//             dateError={dateError}
//           />

//           {canReset && (
//             <OrderTableFiltersResult
//               filters={filters}
//               totalResults={dataFiltered.length}
//               onResetPage={table.onResetPage}
//               sx={{ p: 2.5, pt: 0 }}
//             />
//           )}

//           <Box sx={{ position: 'relative' }}>
//             {/* <TableSelectedAction
//               dense={table.dense}
//               numSelected={table.selected.length}
//               rowCount={dataFiltered.length}
//               onSelectAllRows={(checked) =>
//                 table.onSelectAllRows(
//                   checked,
//                   dataFiltered.map((row) => row.id)
//                 )
//               }
//               action={
//                 <Tooltip title="Delete">
//                   <IconButton color="primary" onClick={confirmDialog.onTrue}>
//                     <Iconify icon="solar:trash-bin-trash-bold" />
//                   </IconButton>
//                 </Tooltip>
//               }
//             /> */}

//             <Scrollbar sx={{ minHeight: 444 }}>
//               <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
//                 <TableHeadCustom
//                   order={table.order}
//                   orderBy={table.orderBy}
//                   headCells={TABLE_HEAD}
//                   rowCount={dataFiltered.length}
//                   onSort={table.onSort}
//                   onSelectAllRows={(checked) =>
//                     table.onSelectAllRows(
//                       checked,
//                       dataFiltered.map((row) => row.id)
//                     )
//                   }
//                 />

//                 <TableBody>
//                   {dataFiltered
//                     .slice(
//                       table.page * table.rowsPerPage,
//                       table.page * table.rowsPerPage + table.rowsPerPage
//                     )
//                     .map((row) => (
//                       <OrderTableRow
//                         key={row.id}
//                         row={row}
//                         selected={table.selected.includes(row.id)}
//                         onSelectRow={() => table.onSelectRow(row.id)}
//                         onDeleteRow={() => handleDeleteRow(row.id)}
//                         detailsHref={paths.dashboard.order.details(row.id)}
//                       />
//                     ))}

//                   <TableEmptyRows
//                     height={table.dense ? 56 : 56 + 20}
//                     emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
//                   />

//                   <TableNoData notFound={notFound} />
//                 </TableBody>
//               </Table>
//             </Scrollbar>
//           </Box>

//           <TablePaginationCustom
//             page={table.page}
//             dense={table.dense}
//             count={dataFiltered.length}
//             rowsPerPage={table.rowsPerPage}
//             onPageChange={table.onChangePage}
//             onChangeDense={table.onChangeDense}
//             onRowsPerPageChange={table.onChangeRowsPerPage}
//           />
//         </Card>
//       </DashboardContent>

//       {renderConfirmDialog()}
//     </>
//   );
// }

// // ----------------------------------------------------------------------

// function applyFilter({ inputData, comparator, filters, dateError }) {
//   const { status, name, startDate, endDate } = filters;

//   const stabilizedThis = inputData.map((el, index) => [el, index]);

//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });

//   inputData = stabilizedThis.map((el) => el[0]);

//   if (name) {
//     inputData = inputData.filter(({ orderNumber, customer }) =>
//       [orderNumber, customer.name, customer.email].some((field) =>
//         field?.toLowerCase().includes(name.toLowerCase())
//       )
//     );
//   }

//   if (status !== 'all') {
//     inputData = inputData.filter((order) => order.status === status);
//   }

//   if (!dateError) {
//     if (startDate && endDate) {
//       inputData = inputData.filter((order) => fIsBetween(order.createdAt, startDate, endDate));
//     }
//   }

//   return inputData;
// }

'use client';
import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Collapse,
  Paper,
  Popover,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Order } from 'src/data/types';
import { Delete, ExpandLess, ExpandMore, MoreVert, Visibility } from '@mui/icons-material';
// import BreadcrumbsCustom from './breadcrumbs';
// import OrderProductsList from './product';
import { ORDER_STATUS_OPTIONS } from 'src/_mock';
import dayjs from 'dayjs';
import { deleteOrder } from 'src/data/api';
import Link from 'next/link';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { useCallback } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Tab from '@mui/material/Tab';

import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';

import { paths } from 'src/routes/paths';

import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { OrderTableRow } from '../order-table-row';
import { OrderTableToolbar } from '../order-table-toolbar';
import { OrderTableFiltersResult } from '../order-table-filters-result';

//---
const STATUS_OPTIONS = [{ value: 'all', label: 'Всі' }, ...ORDER_STATUS_OPTIONS];

const TABLE_HEAD = [
  { id: 'orderNumber', label: 'Номер', width: 88 },
  { id: 'name', label: 'Клієнт' },
  { id: 'createdAt', label: 'Дата замовлення' },
  { id: 'duration', label: 'Час в роботі', width: 140, align: 'center' },
  { id: 'totalQuantity', label: 'Кількість найменувань', align: 'center' },

  { id: 'status', label: 'Статус', width: 110 },
  { id: '', width: 88 },
];

//

interface OrdersPageProps {
  orders: Order[];
}

export function OrderListView({ orders }: OrdersPageProps) {
  const table = useTable({ defaultOrderBy: 'orderNumber' });

  const [tableData, setTableData] = useState(orders);

  const filters = useSetState({
    name: '',
    status: 'all',
  });
  const { state: currentFilters, setState: updateFilters } = filters;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
  });

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      updateFilters({ status: newValue });
    },
    [updateFilters, table]
  );
  const router = useRouter();
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const handleDeleteRow = useCallback(
    async (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      await deleteOrder(id);
      toast.success('Видалення успішне');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const toggleRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoreClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = (id: number) => {
    deleteOrder(id);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Box>
      {/* Breadcrumbs */}
      {/* <BreadcrumbsCustom /> */}

      {/* Header */}
      {/* <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
        <Typography variant="h4">Список замовлень</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/orders/new')}
        >
          Додати замовлення
        </Button>
      </Box> */}

      <DashboardContent>
        <CustomBreadcrumbs
          heading="Список замовлень"
          links={[{ name: 'Дашборд', href: paths.dashboard.root }, { name: 'Список замовлень' }]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <Tabs
            value={currentFilters.status}
            onChange={handleFilterStatus}
            sx={[
              (theme) => ({
                px: 2.5,
                boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
              }),
            ]}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === currentFilters.status) && 'filled') ||
                      'soft'
                    }
                    color={
                      (tab.value === 'completed' && 'success') ||
                      (tab.value === 'pending' && 'warning') ||
                      (tab.value === 'cancelled' && 'error') ||
                      'default'
                    }
                  >
                    {['completed', 'pending', 'cancelled', 'refunded'].includes(tab.value)
                      ? tableData.filter((user) => user.status === tab.value).length
                      : tableData.length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          {/* <OrderTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            dateError={dateError}
          />

          {canReset && (
            <OrderTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )} */}

          <Box sx={{ position: 'relative' }}>
            <Scrollbar sx={{ minHeight: 444 }}>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headCells={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  onSort={table.onSort}
                  // onSelectAllRows={(checked) =>
                  //   table.onSelectAllRows(
                  //     checked,
                  //     dataFiltered.map((row) => row.id)
                  //   )
                  // }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <OrderTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        // onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        detailsHref={paths.dashboard.order.details(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  {/* <TableNoData notFound={notFound} /> */}
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>

      {/* Orders Table */}
      {/* <TableContainer component={Paper} sx={{ borderRadius: '12px' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'background.neutral' }}>
              <TableCell>№</TableCell>
              <TableCell>Клієнт</TableCell>
              <TableCell>Контакт</TableCell>
              <TableCell>Дата</TableCell>
              <TableCell>Кількість</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order, index) => (
              <React.Fragment key={index}>
                <TableRow key={order.id} hover={true}>
                  <TableCell>
                    <Link href={`/orders/${order.id}`}>#{order.id}</Link>
                  </TableCell>
                  <TableCell>{order.client_name}</TableCell>
                  <TableCell>{order.client_contact_number}</TableCell>
                  <TableCell>{dayjs(order.date_of_order).format('DD/MM/YYYY')}</TableCell>
                  <TableCell>{order.order_items.length}</TableCell>
                  <TableCell>{order.order_status}</TableCell>
                  <TableCell align="right">
                    {expandedRow === order.id ? (
                      <IconButton onClick={() => toggleRow(order.id || 0)}>
                        <ExpandLess fontSize="medium" />
                      </IconButton>
                    ) : (
                      <IconButton onClick={() => toggleRow(order.id || 0)}>
                        <ExpandMore fontSize="medium" />
                      </IconButton>
                    )}
                    <IconButton aria-describedby={id} onClick={handleMoreClick}>
                      <MoreVert fontSize="medium" />
                    </IconButton>
                    <Popover
                      id={id}
                      open={open}
                      anchorEl={anchorEl}
                      onClose={handleMoreClose}
                      anchorOrigin={{
                        vertical: 'center',
                        horizontal: 'left',
                      }}
                      transformOrigin={{
                        vertical: 'center',
                        horizontal: 'right',
                      }}
                    >
                      <Paper sx={{ p: 1 }}>
                        <Stack>
                          <Button
                            sx={{ textTransform: 'capitalize' }}
                            color="error"
                            startIcon={<Delete />}
                            onClick={() => handleDelete(order.id || 0)}
                          >
                            {' '}
                            Видалити
                          </Button>
                          <Button
                            sx={{
                              textTransform: 'capitalize',
                              color: 'common.black',
                            }}
                            startIcon={<Visibility />}
                            onClick={() => router.push(`/orders/${order.id}`)}
                          >
                            {' '}
                            Перегляд
                          </Button>
                        </Stack>
                      </Paper>
                    </Popover>
                  </TableCell>
                </TableRow>
                <TableRow sx={{ bgcolor: 'background.neutral' }}>
                  <TableCell colSpan={7}>
                    <Collapse in={expandedRow === order.id} timeout="auto" unmountOnExit></Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}
    </Box>
  );
}

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { status, name, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(({ orderNumber, customer }) =>
      [orderNumber, customer.name, customer.email].some((field) =>
        field?.toLowerCase().includes(name.toLowerCase())
      )
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((order) => order.status === status);
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((order) => fIsBetween(order.createdAt, startDate, endDate));
    }
  }

  return inputData;
}
