import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  RowData,
  RowSelectionState,
  SortingState,
  TableOptions,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ReactNode, useEffect, useState } from "react";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    className: string;
  }
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  filterableColumns?: {
    id: string;
    title: string;
    options: {
      label: string;
      value: string;
    }[];
  }[];
  pageCount?: number;
  onPaginationChange?: OnChangeFn<PaginationState>;
  pageIndex?: number;
  pageSize?: number;
  loading?: boolean;
  onSearchChange?: (search: string) => void;
  searchValue?: string;
  customFilters?: ReactNode;
  emptyMessage?: string;
  enableRowSelection?: boolean;
  onSelectionChange?: (selectedRows: TData[]) => void;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  customRowSelection?: RowSelectionState;
  extraTableProps?: Partial<TableOptions<TData>>;
}

export function DataTable<TData>({
  columns,
  data,
  filterableColumns,
  pageCount,
  onPaginationChange,
  pageIndex = 0,
  pageSize = 10,
  loading = false,
  onSearchChange,
  searchValue = "",
  customFilters,
  emptyMessage = "No results found.",
  enableRowSelection = true,
  onRowSelectionChange,
  customRowSelection,
  onSelectionChange,
  extraTableProps
}: DataTableProps<TData>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection: customRowSelection ?? rowSelection,
      columnFilters,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    pageCount,
    manualPagination: !!onPaginationChange,
    onPaginationChange: onPaginationChange,
    enableRowSelection,
    onRowSelectionChange: onRowSelectionChange ?? setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    ...extraTableProps,
  });

  // Seçim değiştiğinde callback'i çağır
  useEffect(() => {
    if (onSelectionChange) {
      const selectedRows = table
        .getSelectedRowModel()
        .rows.map((row) => row.original);
      onSelectionChange(selectedRows);
    }
  }, [table.getSelectedRowModel().rows, onSelectionChange]);

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        filterableColumns={filterableColumns}
        onSearchSubmit={onSearchChange}
        searchValue={searchValue}
        customFilters={customFilters}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(function (headerGroup) {
              return (
                <TableRow key={headerGroup.id} className="group/row">
                  {headerGroup.headers.map(function (header) {
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className={
                          header.column.columnDef.meta?.className ?? ""
                        }
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(function (row) {
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="group/row"
                  >
                    {row.getVisibleCells().map(function (cell) {
                      return (
                        <TableCell
                          key={cell.id}
                          className={
                            cell.column.columnDef.meta?.className ?? ""
                          }
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
