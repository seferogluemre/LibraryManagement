import { UpdateSupplierForm } from "#components/form/update/update-supplier.js";
import { IdDisplay } from "#components/id-display";
import { Badge } from "#components/ui/badge";
import { Button } from "#components/ui/button";
import { CompanyTypeBadgeColor, CompanyTypeText } from "#constant/company";
import { useFormDialogs } from "#hooks/use-form-dialogs.js";
import { toast } from "#hooks/use-toast.js";
import { api } from "#lib/api.js";
import { useConfirmationDialog } from "#store/use-confirmation-dialog.js";
import { CompanyShowResponse } from "@onlyjs/api";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";

const columnHelper = createColumnHelper<CompanyShowResponse>();

const RowActions = ({ row }: { row: { original: CompanyShowResponse } }) => {
  const { openForm } = useFormDialogs();
  const { show } = useConfirmationDialog();
  const queryClient = useQueryClient();

  const handleEdit = () => {
    openForm(
      "Edit Supplier",
      (onClose) => (
        <UpdateSupplierForm
          supplierData={row.original}
          onClose={onClose}
          onSuccess={() => {
            // Refresh the companies list
            queryClient.invalidateQueries({ queryKey: ["companies"] });
            onClose();
          }}
        />
      ),
      "lg"
    );
  };

  const handleDelete = async () => {
    try {
      const response = await api.company({ uuid: row.original.uuid }).delete();
      
      if (response.error) {
        toast({
          title: "Error",
          description: "Failed to delete supplier",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Supplier deleted successfully",
      });

      // Refresh the companies list
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete supplier",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = () => {
    show({
      title: "Delete Supplier",
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

export const companyColumns: ColumnDef<CompanyShowResponse, any>[] = [
  columnHelper.accessor("uuid", {
    header: "ID",
    cell: ({ row }) => <IdDisplay id={row.original.uuid} />,
  }),
  columnHelper.accessor("name", {
    header: "Company Name",
    cell: ({ row }) => row.original.name,
  }),
  columnHelper.accessor("type", {
    header: "Company Type",
    cell: ({ row }) => (
      <Badge 
        variant="secondary" 
        className={`text-white ${CompanyTypeBadgeColor[row.original.type] || "bg-gray-600 hover:bg-gray-700"}`}
      >
        {CompanyTypeText[row.original.type] || row.original.type}
      </Badge>
    ),
  }),
  columnHelper.accessor("description", {
    header: "Description",
    cell: ({ row }) => (
      <div
        className="max-w-[180px] truncate"
        title={row.original.description ?? ""}
      >
        {row.original.description || "-"}
      </div>
    ),
  }),
  columnHelper.accessor("authorizedForRfqs", {
    header: "Authorized for RFQs",
    cell: ({ row }) => row.original.authorizedForRfqs || "-",
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
