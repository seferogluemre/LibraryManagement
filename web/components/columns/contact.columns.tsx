import { UpdateContactForm } from "#components/form/update/update-contact.js";
import { IdDisplay } from "#components/id-display";
import { Badge } from "#components/ui/badge";
import { Button } from "#components/ui/button";
import { ContactTypeBadgeColor, ContactTypeText } from "#constant/contact";
import { useFormDialogs } from "#hooks/use-form-dialogs.js";
import { toast } from "#hooks/use-toast.js";
import { api } from "#lib/api.js";
import { useConfirmationDialog } from "#store/use-confirmation-dialog.js";
import { ContactShowResponse } from "@onlyjs/api";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";

const columnHelper = createColumnHelper<ContactShowResponse>();

const RowActions = ({ row }: { row: { original: ContactShowResponse } }) => {
  const { openForm } = useFormDialogs();
  const { show } = useConfirmationDialog();
  const queryClient = useQueryClient();

  const handleEdit = () => {
    openForm(
      "Edit Contact",
      (onClose) => (
        <UpdateContactForm
          contactData={row.original}
          onClose={onClose}
          onSuccess={() => {
            // Refresh the contacts list
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
            onClose();
          }}
        />
      ),
      "lg"
    );
  };

  const handleDelete = async () => {
    try {
      const response = await api.contacts({ uuid: row.original.uuid }).delete();
      
      if (response.error) {
        toast({
          title: "Error",
          description: "Failed to delete contact",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Contact deleted successfully",
      });

      // Refresh the contacts list
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete contact",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = () => {
    show({
      title: "Delete Contact",
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

export const contactColumns: ColumnDef<ContactShowResponse, any>[] = [
  columnHelper.accessor("uuid", {
    header: "ID",
    cell: ({ row }) => <IdDisplay id={row.original.uuid} />,
  }),
  columnHelper.accessor("name", {
    header: "Name",
    cell: ({ row }) => row.original.name,
  }),
  columnHelper.accessor("type", {
    header: "Type",
    cell: ({ row }) => (
      <Badge 
        variant="secondary" 
        className={`text-white ${ContactTypeBadgeColor[row.original.type] || "bg-gray-600 hover:bg-gray-700"}`}
      >
        {ContactTypeText[row.original.type] || row.original.type}
      </Badge>
    ),
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: ({ row }) => row.original.email || "-",
  }),
  columnHelper.accessor("phone", {
    header: "Phone",
    cell: ({ row }) => row.original.phone || "-",
  }),
  columnHelper.accessor("title", {
    header: "Title",
    cell: ({ row }) => row.original.title || "-",
  }),
  columnHelper.accessor("company.name", {
    header: "Company",
    cell: ({ row }) => row.original.company?.name || "-",
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
