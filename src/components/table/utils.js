import dayjs from 'dayjs';

import { formatPatterns } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export function rowInPage(data, page, rowsPerPage) {
  return data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}

// ----------------------------------------------------------------------

export function emptyRows(page, rowsPerPage, arrayLength) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

// ----------------------------------------------------------------------

/**
 * @example
 * const data = {
 *   calories: 360,
 *   align: 'center',
 *   more: {
 *     protein: 42,
 *   },
 * };
 *
 * const ex1 = getNestedProperty(data, 'calories');
 * console.log('ex1', ex1); // output: 360
 *
 * const ex2 = getNestedProperty(data, 'align');
 * console.log('ex2', ex2); // output: center
 *
 * const ex3 = getNestedProperty(data, 'more.protein');
 * console.log('ex3', ex3); // output: 42
 */
function getNestedProperty(obj, key) {
  if (!obj) return undefined;

  // Handle array length property
  if (key === 'orderItems') {
    return obj[key]?.length || 0;
  }

  // Handle nested properties
  return key.split('.').reduce((acc, part) => {
    if (acc === undefined || acc === null) return undefined;
    return acc[part];
  }, obj);
}

function descendingComparator(a, b, orderBy) {
  const aValue = getNestedProperty(a, orderBy);
  const bValue = getNestedProperty(b, orderBy);

  // Handle undefined values
  if (aValue === undefined && bValue === undefined) return 0;
  if (aValue === undefined) return 1;
  if (bValue === undefined) return -1;

  // Handle date values
  if (orderBy === 'dateOfOrder') {
    return new Date(bValue) - new Date(aValue);
  }

  // Handle string values
  if (typeof aValue === 'string' && typeof bValue === 'string') {
    return bValue.localeCompare(aValue);
  }

  // Handle numeric values
  if (bValue < aValue) {
    return -1;
  }
  if (bValue > aValue) {
    return 1;
  }

  return 0;
}

// ----------------------------------------------------------------------

function sortByField(a, b, field, order) {
  // Handle empty or invalid values
  if (!a || !b) return 0;

  let valueA = a[field];
  let valueB = b[field];
  const now = new Date().getTime();

  // Special handling for specific fields
  switch (field) {
    case 'orderItems':
      valueA = a.orderItems?.length || 0;
      valueB = b.orderItems?.length || 0;
      break;
    case 'dateOfOrder':
      valueA = dayjs(a.dateOfOrder, formatPatterns.dateTime).valueOf();
      valueB = dayjs(b.dateOfOrder, formatPatterns.dateTime).valueOf();

      break;
    case 'daysInWork':
      // Calculate days between now and order date
      valueA = Math.floor(
        (now - dayjs(a.dateOfOrder, formatPatterns.dateTime).valueOf()) / (1000 * 60 * 60 * 24)
      );
      valueB = Math.floor(
        (now - dayjs(b.dateOfOrder, formatPatterns.dateTime).valueOf()) / (1000 * 60 * 60 * 24)
      );
      break;
    case 'clientName':
    case 'orderStatus':
      valueA = String(valueA || '').toLowerCase();
      valueB = String(valueB || '').toLowerCase();
      break;
    default:
      // For numeric values
      valueA = Number(valueA) || 0;
      valueB = Number(valueB) || 0;
  }

  // Compare values
  if (valueA < valueB) {
    return order === 'asc' ? -1 : 1;
  }
  if (valueA > valueB) {
    return order === 'asc' ? 1 : -1;
  }
  return 0;
}

// ----------------------------------------------------------------------

export function getComparator(order, orderBy) {
  return (a, b) => sortByField(a, b, orderBy, order);
}
