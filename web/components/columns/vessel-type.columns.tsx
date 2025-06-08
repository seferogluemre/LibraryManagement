import { UpdateVesselTypeForm } from "#components/form/update/update-vessel-type.js";
import { IdDisplay } from "#components/id-display";
import { Button } from "#components/ui/button";
import { useFormDialogs } from "#hooks/use-form-dialogs.js";
import { toast } from "#hooks/use-toast.js";
import { api } from "#lib/api.js";
import { useConfirmationDialog } from "#store/use-confirmation-dialog.js";
import { VesselTypeShowResponse } from "@onlyjs/api";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";

const columnHelper = createColumnHelper<VesselTypeShowResponse>();

const RowActions = ({ row }: { row: { original: VesselTypeShowResponse } }) => {
  const { openForm } = useFormDialogs();
  const { show } = useConfirmationDialog();
  const queryClient = useQueryClient();

  const handleEdit = () => {
    openForm(
      "Edit Vessel Type",
      (onClose) => (
        <UpdateVesselTypeForm
          vesselTypeData={row.original}
          onClose={onClose}
          onSuccess={() => {
            // Refresh the vessel types list
            queryClient.invalidateQueries({ queryKey: ["vessel-types"] });
            onClose();
          }}
        />
      ),
      "md"
    );
  };

  const handleDelete = async () => {
    try {
      const response = await api["vessel-types"]({ uuid: row.original.uuid }).delete();
      
      if (response.error) {
        toast({
          title: "Error",
          description: "Failed to delete vessel type",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Vessel type deleted successfully",
      });

      // Refresh the vessel types list
      queryClient.invalidateQueries({ queryKey: ["vessel-types"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete vessel type",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = () => {
    show({
      title: "Delete Vessel Type",
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

export const vesselTypeColumns: ColumnDef<VesselTypeShowResponse, any>[] = [
  columnHelper.accessor("uuid", {
    header: "ID",
    cell: ({ row }) => <IdDisplay id={row.original.uuid} />,
  }),

  columnHelper.accessor("name", {
    header: "Name",
    cell: ({ row }) => row.original.name,
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
