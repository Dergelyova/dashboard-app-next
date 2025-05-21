'use client';

import { varAlpha } from 'minimal-shared/utils';
import { useSetState } from 'minimal-shared/hooks';
import React, { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Switch from '@mui/material/Switch';
import { Box, Table, TableBody } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';

import { Order } from 'src/data/types';
import { deleteOrder } from 'src/data/api';
import { ORDER_STATUS_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  rowInPage,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { OrderTableRow } from '../order-table-row';

//---
const STATUS_OPTIONS = [{ value: 'all', label: 'Всі' }, ...ORDER_STATUS_OPTIONS];

const TABLE_HEAD = [
  { id: 'id', label: 'Номер', width: 88 },
  { id: 'clientName', label: 'Клієнт' },
  { id: 'dateOfOrder', label: 'Дата замовлення' },
  { id: 'daysInWork', label: 'Днів в роботі', width: 140, align: 'center' },
  { id: 'orderItems', label: 'Кількість найменувань', align: 'center' },
  { id: 'orderStatus', label: 'Статус', width: 110 },
  { id: '', width: 88 },
];

//

interface OrdersPageProps {
  orders: Order[];
}

export function OrderListView({ orders }: OrdersPageProps) {
  const table = useTable({
    defaultOrderBy: 'dateOfOrder',
    defaultOrder: 'desc',
    defaultDense: true,
  });

  const [tableData, setTableData] = useState(orders);
  const [expandAll, setExpandAll] = useState(false);

  const filters = useSetState({
    name: '',
    status: 'all',
  });
  const { state: currentFilters, setState: updateFilters } = filters;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
    dateError: false,
  });

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      updateFilters({ status: newValue });
    },
    [updateFilters, table]
  );

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

  return (
    <Box>
      <DashboardContent>
        {/*@ts-expect-error: CustomBreadcrumbs props may not match expected type */}
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
                boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.palette.grey['500Channel'], 0.08)}`,
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
                    // @ts-expect-error: Label color prop may not match expected type
                    color={
                      (tab.value === 'completed' && 'success') ||
                      (tab.value === 'pending' && 'warning') ||
                      (tab.value === 'cancelled' && 'error') ||
                      'default'
                    }
                  >
                    {['completed', 'pending', 'cancelled', 'refunded'].includes(tab.value)
                      ? tableData.filter((user) => user.orderStatus === tab.value).length
                      : tableData.length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <Box sx={{ position: 'relative' }}>
            <Box sx={{ overflowX: 'auto' }}>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headCells={TABLE_HEAD}
                  onSort={table.onSort}
                  sx={{}}
                />

                <TableBody>
                  {dataInPage.map((row, index) => (
                    <OrderTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      isEven={index % 2 === 0}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      detailsHref={paths.dashboard.order.details(row.id)}
                      expandAll={expandAll}
                    />
                  ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                    sx={{}}
                  />
                </TableBody>
              </Table>
            </Box>
          </Box>

          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}
          >
            <FormControlLabel
              label="Розгорнути всі"
              control={
                <Switch
                  checked={expandAll}
                  onChange={(e) => setExpandAll(e.target.checked)}
                  inputProps={{ id: 'expand-all-switch' }}
                />
              }
            />

            <TablePaginationCustom
              page={table.page}
              dense
              count={dataFiltered.length}
              rowsPerPage={table.rowsPerPage}
              onPageChange={table.onChangePage}
              onChangeDense={() => {}}
              onRowsPerPageChange={table.onChangeRowsPerPage}
              sx={{}}
            />
          </Box>
        </Card>
      </DashboardContent>
    </Box>
  );
}

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { status, name } = filters;

  // First apply sorting
  const sortedData = [...inputData].sort(comparator);

  // Then apply filters
  let filteredData = sortedData;

  if (name) {
    filteredData = filteredData.filter((order) =>
      [order.id, order.clientName, order.clientContactNumber].some((field) =>
        String(field || '')
          .toLowerCase()
          .includes(name.toLowerCase())
      )
    );
  }

  if (status !== 'all') {
    filteredData = filteredData.filter((order) => order.orderStatus === status);
  }

  return filteredData;
}
