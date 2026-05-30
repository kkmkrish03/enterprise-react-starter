import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  CircularProgress,
  Pagination,
  Box,
  Typography
} from '@mui/material';

export interface ColumnConfig<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
}

export interface PaginationConfig {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
  onSort: (key: string) => void;
}

export interface DataTableProps<T> {
  columns: ColumnConfig<T>[];
  data: T[];
  isLoading?: boolean;
  pagination?: PaginationConfig;
  sort?: SortConfig;
  emptyMessage?: string;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  isLoading = false,
  pagination,
  sort,
  emptyMessage = 'No data available',
}: DataTableProps<T>) {
  return (
    <Box sx={{ width: '100%' }}>
      <TableContainer component={Paper} variant="outlined" sx={{ overflowX: 'auto', position: 'relative' }}>
        <Table sx={{ minWidth: 650 }} aria-label="data table">
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              {columns.map((column) => {
                const isSorted = sort?.key === column.key;
                return (
                  <TableCell
                    key={column.key}
                    sortDirection={isSorted ? sort.direction : false}
                    sx={{ fontWeight: 'bold' }}
                  >
                    {column.sortable && sort ? (
                      <TableSortLabel
                        active={isSorted}
                        direction={isSorted ? sort.direction : 'asc'}
                        onClick={() => sort.onSort(column.key)}
                      >
                        {column.header}
                      </TableSortLabel>
                    ) : (
                      column.header
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <CircularProgress size={32} />
                    <Typography variant="body2" color="text.secondary">
                      Loading data...
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow
                  key={row.id}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render ? column.render(row, rowIndex) : (row as any)[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, px: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Page {pagination.currentPage} of {pagination.totalPages}
          </Typography>
          <Pagination
            count={pagination.totalPages}
            page={pagination.currentPage}
            onChange={(_, page) => pagination.onPageChange(page)}
            color="primary"
            size="small"
          />
        </Box>
      )}
    </Box>
  );
}
