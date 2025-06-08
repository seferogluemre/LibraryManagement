import { UpdateProductCategoryForm } from "#components/form/update/update-product-category.js";
import { IdDisplay } from "#components/id-display";
import { Button } from "#components/ui/button";
import { useFormDialogs } from "#hooks/use-form-dialogs.js";
import { toast } from "#hooks/use-toast.js";
import { api } from "#lib/api.js";
import { useConfirmationDialog } from "#store/use-confirmation-dialog.js";
import { ProductCategoryShowResponse } from "@onlyjs/api";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

const RowActions = ({
  row,
}: {
  row: { original: ProductCategoryShowResponse };
}) => {
  const queryClient = useQueryClient();
  const { openForm } = useFormDialogs();
  const { show: showConfirmDialog } = useConfirmationDialog();

  const handleEdit = () => {
    openForm(
      "Edit Product Category",
      (onClose) => (
        <UpdateProductCategoryForm
          categoryData={row.original}
          onClose={onClose}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["product-categories"] });
            onClose();
          }}
        />
      ),
      "md"
    );
  };

  const handleDelete = () => {
    showConfirmDialog({
      title: "Delete Product Category",
      description: `Are you sure you want to delete "${row.original.name}"? This action cannot be undone.`,
      approveText: "Delete",
      rejectText: "Cancel",
      onApprove: async () => {
        try {
          await api["product-category"]({ uuid: row.original.uuid }).delete();

          toast({
            title: "Success",
            description: "Product category deleted successfully",
          });

          queryClient.invalidateQueries({ queryKey: ["product-categories"] });
        } catch (error) {
          console.error("Error deleting product category:", error);
          toast({
            title: "Error",
            description: "Failed to delete product category",
            variant: "destructive",
          });
        }
      },
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="sm" onClick={handleEdit}>
        <IconEdit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={handleDelete}>
        <IconTrash className="h-4 w-4" />
      </Button>
    </div>
  );
};

export const productCategoryColumns: ColumnDef<ProductCategoryShowResponse>[] =
  [
    {
      accessorKey: "uuid",
      header: "ID",
      cell: ({ getValue }) => <IdDisplay id={getValue() as string} />,
    },
    {
      accessorKey: "name",
      header: "Category Name",
      cell: ({ getValue }) => (
        <div className="font-medium">{getValue() as string}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ getValue }) =>
        format(new Date(getValue() as string), "MMM dd, yyyy"),
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: ({ getValue }) =>
        format(new Date(getValue() as string), "MMM dd, yyyy"),
    },
    {
      id: "actions",
      header: "Actions",
      cell: RowActions,
    },
  ];
