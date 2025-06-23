import { getColumns } from "@/components/columns/publishers-columns";
import { PublishersDataTable } from "@/components/data-table/publishers-data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { AddEditPublisherModal } from "@/features/publishers/components/add-edit-publisher-modal";
import { DeletePublisherDialog } from "@/features/publishers/components/delete-publisher-dialog";
import { PublisherStats } from "@/features/publishers/components/publisher-stats";
import { type Publisher } from "@/features/publishers/types";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { type ColumnFiltersState, type PaginationState, type SortingState } from "@tanstack/react-table";
import React from "react";

export const Route = createFileRoute("/_authenticated/publishers")({
  component: PublishersPage,
});

// Define an enum for modal types
enum ModalType {
  None,
  Add,
  Edit,
  Delete,
}

function PublishersPage() {
  const [modalState, setModalState] = React.useState(ModalType.None);
  const [selectedPublisher, setSelectedPublisher] =
    React.useState<Publisher | null>(null);

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

  const nameFilter = columnFilters.find((f) => f.id === "name")?.value as
    | string
    | undefined;

  const handleOpenAdd = () => setModalState(ModalType.Add);
  const handleOpenEdit = (publisher: Publisher) => {
    setSelectedPublisher(publisher);
    setModalState(ModalType.Edit);
  };
  const handleOpenDelete = (publisher: Publisher) => {
    setSelectedPublisher(publisher);
    setModalState(ModalType.Delete);
  };
  const handleCloseModal = () => {
    setModalState(ModalType.None);
    setSelectedPublisher(null);
  };

  const columns = React.useMemo(
    () => getColumns({ onEdit: handleOpenEdit, onDelete: handleOpenDelete }),
    []
  );

  React.useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [nameFilter]);

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "publishers",
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      nameFilter,
    ],
    queryFn: () =>
      api.publishers.get({
        query: {
          page: (pagination.pageIndex + 1).toString(),
          limit: pagination.pageSize.toString(),
          sort: sorting[0]?.id,
          order: sorting[0]?.desc ? "desc" : "asc",
          search: nameFilter,
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

  const handleSearch = (searchValue: string) => {
    setColumnFilters([{ id: "name", value: searchValue }]);
  };

  return (
    <>
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
          onSearch={handleSearch}
          onAdd={handleOpenAdd}
        />
        <PublisherStats totalPublishers={totalCount} />
      </div>

      <AddEditPublisherModal
        isOpen={modalState === ModalType.Add || modalState === ModalType.Edit}
        onClose={handleCloseModal}
        publisher={modalState === ModalType.Edit ? selectedPublisher : null}
      />
      <DeletePublisherDialog
        isOpen={modalState === ModalType.Delete}
        onClose={handleCloseModal}
        publisher={selectedPublisher}
      />
    </>
  );
}
