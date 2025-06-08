import { toast } from "#hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  PaginationState,
  SortingState,
  TableOptions,
} from "@tanstack/react-table";
import _ from "lodash";
import { ReactNode, useState } from "react";
import { DataTable } from "./data-table";

interface PaginatedData<T> {
  data: T[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    pageCount: number;
  };
}

interface SortingOption {
  id: string;
  desc: boolean;
}

interface PaginatedDataTableProps<
  TData,
  TFilter extends Record<string, any> = Record<string, any>,
> {
  columns: ColumnDef<TData, any>[];
  queryKey: unknown[];
  queryFn: (
    pagination: { page: number; pageSize: number },
    search?: string,
    sorting?: SortingOption[],
  ) => Promise<PaginatedData<TData>>;

  filterableColumns?: {
    id: string;
    title: string;
    options: {
      label: string;
      value: string;
    }[];
  }[];

  headerActions?: ReactNode;
  extraTableProps?: Partial<TableOptions<TData>>;
}

export function PaginatedDataTable<
  TData,
  TFilter extends Record<string, any> = Record<string, any>,
>({
  columns,
  queryKey,
  queryFn,
  filterableColumns,
  headerActions,
  extraTableProps,
}: PaginatedDataTableProps<TData, TFilter>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: [
      ...queryKey,
      pagination.pageIndex,
      pagination.pageSize,
      search,
      sorting,
    ],
    queryFn: () =>
      queryFn(
        {
          page: pagination.pageIndex + 1, // Convert 0-based to 1-based
          pageSize: pagination.pageSize,
        },
        search || undefined,
        sorting.length > 0
          ? sorting.map((sort) => ({ id: sort.id, desc: sort.desc }))
          : undefined,
      ),
    throwOnError: false, // Handle errors manually
  });

  // Handle errors with toast
  if (error) {
    toast({
      title: "Hata",
      description: error instanceof Error ? error.message : "Bilinmeyen hata",
      variant: "destructive",
    });
  }

  const onSearchChange = _.debounce((value: string) => {
    setSearch(value);
    // Reset to first page when searching
    setPagination(prev => ({
      ...prev,
      pageIndex: 0,
    }));
  }, 300);

  const handlePaginationChange = (updater: any) => {
    if (typeof updater === 'function') {
      setPagination(updater);
    } else {
      setPagination(updater);
    }
  };

  // Custom filters content
  const customFiltersContent = (
    <div className="flex w-full flex-row justify-between gap-1">
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"></div>
      {headerActions}
    </div>
  );

  // Configure table with manual pagination and sorting
  const tableProps: Partial<TableOptions<TData>> = {
    ...extraTableProps,
    manualPagination: true,
    manualSorting: true,
    pageCount: data?.meta.pageCount ?? 0,
    state: {
      ...(extraTableProps?.state || {}),
      pagination,
      sorting,
    },
    onPaginationChange: handlePaginationChange,
    onSortingChange: setSorting,
  };

  return (
    <DataTable
      columns={columns}
      data={data?.data || []}
      filterableColumns={filterableColumns}
      pageCount={data?.meta.pageCount ?? 0}
      pageIndex={pagination.pageIndex}
      pageSize={pagination.pageSize}
      onPaginationChange={handlePaginationChange}
      loading={isLoading}
      onSearchChange={onSearchChange}
      searchValue={search}
      customFilters={customFiltersContent}
      extraTableProps={tableProps}
    />
  );
}
