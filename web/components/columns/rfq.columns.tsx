import { UpdateRfqForm } from "#components/form/update/update-rfq.js";
import { IdDisplay } from "#components/id-display";
import { Button } from "#components/ui/button";
import { useFormDialogs } from "#hooks/use-form-dialogs.js";
import { toast } from "#hooks/use-toast.js";
import { api } from "#lib/api.js";
import { useConfirmationDialog } from "#store/use-confirmation-dialog.js";
import { RfqShowResponse } from "@onlyjs/api";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";

const columnHelper = createColumnHelper<RfqShowResponse>();

const RowActions = ({ row }: { row: { original: RfqShowResponse } }) => {
  const { openForm } = useFormDialogs();
  const { show } = useConfirmationDialog();
  const queryClient = useQueryClient();

  const handleEdit = () => {
    openForm(
      "Edit RFQ",
      (onClose) => (
        <UpdateRfqForm
          rfqData={row.original}
          onClose={onClose}
          onSuccess={() => {
            // Refresh the RFQs list
            queryClient.invalidateQueries({ queryKey: ["rfqs"] });
            onClose();
          }}
        />
      ),
      "lg"
    );
  };

  const handleDelete = async () => {
    try {
      const response = await api.rfq({ uuid: row.original.uuid }).delete();

      if (response.error) {
        toast({
          title: "Error",
          description: "Failed to delete RFQ",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "RFQ deleted successfully",
      });

      // Refresh the RFQs list
      queryClient.invalidateQueries({ queryKey: ["rfqs"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete RFQ",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = () => {
    show({
      title: "Delete RFQ",
      description: `Are you sure you want to delete "${row.original.name}"? This action cannot be undone.`,
      approveText: "Delete",
      rejectText: "Cancel",
      onApprove: handleDelete,
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button size="icon" variant="outline" title="Edit" onClick={handleEdit}>
        <IconEdit className="size-4" />
      </Button>
      <Button
        size="icon"
        variant="outline"
        title="Delete"
        className="text-destructive"
        onClick={confirmDelete}
      >
        <IconTrash className="size-4" />
      </Button>
    </div>
  );
};

export const rfqColumns: ColumnDef<RfqShowResponse, any>[] = [
  columnHelper.accessor("uuid", {
    header: "ID",
    cell: ({ row }) => <IdDisplay id={row.original.uuid} />,
  }),
  columnHelper.accessor("name", {
    header: "RFQ Name",
    cell: ({ row }) => row.original.name,
  }),
  columnHelper.accessor("project", {
    header: "Project",
    cell: ({ row }) => row.original.project?.name || "-",
  }),
  columnHelper.accessor("supplier", {
    header: "Supplier",
    cell: ({ row }) => row.original.supplier?.name || "-",
  }),
  columnHelper.accessor("shipyard", {
    header: "Shipyard",
    cell: ({ row }) => row.original.shipyard?.name || "-",
  }),
  columnHelper.accessor("projectCategoryUuid", {
    header: "Project Category",
    cell: ({ row }) => (
      <div
        className="max-w-[180px] truncate"
        title={row.original.projectCategoryUuid}
      >
        {row.original.projectCategoryUuid}
      </div>
    ),
  }),
  columnHelper.accessor("createdAt", {
    header: "Created At",
    cell: ({ row }) => format(row.original.createdAt, "dd/MM/yyyy HH:mm"),
  }),
  columnHelper.accessor("updatedAt", {
    header: "Updated At",
    cell: ({ row }) => format(row.original.updatedAt, "dd/MM/yyyy HH:mm"),
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <RowActions row={row} />,
  }),
];
