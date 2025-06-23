import { columns } from "@/components/columns/publishers-columns";
import { PublishersDataTable } from "@/components/data-table/publishers-data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { PublisherStats } from "@/features/publishers/components/publisher-stats";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { type ColumnFiltersState, type PaginationState, type SortingState } from "@tanstack/react-table";
import React from "react";

export const Route = createFileRoute("/_authenticated/publishers")({
  component: PublishersPage,
});

function PublishersPage() {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "name", desc: false },
  ]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [nameFilter, setNameFilter] = React.useState("");

  const debouncedNameFilter = useDebounce(nameFilter, 300);

  React.useEffect(() => {
    setColumnFilters([{ id: "name", value: debouncedNameFilter }]);
  }, [debouncedNameFilter]);

  React.useEffect(() => {
    // Reset to first page when filter changes
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [debouncedNameFilter]);

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "publishers",
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      debouncedNameFilter,
    ],
    queryFn: () =>
      api.publishers.get({
        query: {
          page: (pagination.pageIndex + 1).toString(),
          limit: pagination.pageSize.toString(),
          sort: sorting[0]?.id,
          order: sorting[0]?.desc ? "desc" : "asc",
          search: debouncedNameFilter,
        },
      }),
  });

  const tableData = data?.data?.data ?? [];
  const totalCount = data?.data?.total ?? 0;
  const pageCount = Math.ceil(totalCount / pagination.pageSize);

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error) {
    return <div>An error occurred: {error.message}</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Yayınevleri</h1>
          <p className="text-muted-foreground">
            Kütüphanedeki kitapların yayınevlerini yönetin
          </p>
        </div>
      </div>
      <PublishersDataTable
        columns={columns}
        data={tableData}
        pageCount={pageCount}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        nameFilter={nameFilter}
        setNameFilter={setNameFilter}
      />
      <PublisherStats totalPublishers={totalCount} />
    </div>
  );
}

function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
