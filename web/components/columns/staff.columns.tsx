import { UpdateStaffForm } from "#components/form/update/update-staff.js";
import { IdDisplay } from "#components/id-display";
import { Badge } from "#components/ui/badge";
import { Button } from "#components/ui/button";
import { UserStatusBadgeColor, UserStatusText } from "#constant/user";
import { useFormDialogs } from "#hooks/use-form-dialogs.js";
import { toast } from "#hooks/use-toast.js";
import { api } from "#lib/api.js";
import { useConfirmationDialog } from "#store/use-confirmation-dialog.js";
import { UserShowResponse } from "@onlyjs/api";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";

const columnHelper = createColumnHelper<UserShowResponse>();

const RowActions = ({ row }: { row: { original: UserShowResponse } }) => {
  const { openForm } = useFormDialogs();
  const { show } = useConfirmationDialog();
  const queryClient = useQueryClient();

  const handleEdit = () => {
    openForm(
      "Edit Staff",
      (onClose) => (
        <UpdateStaffForm
          staffData={row.original}
          onClose={onClose}
          onSuccess={() => {
            // Refresh the staff list
            queryClient.invalidateQueries({ queryKey: ["staff"] });
            onClose();
          }}
        />
      ),
      "lg"
    );
  };

  const handleDelete = async () => {
    try {
      const response = await api.users({ id: row.original.id }).delete();
      
      if (response.error) {
        toast({
          title: "Error",
          description: "Failed to delete staff member",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Staff member deleted successfully",
      });

      // Refresh the staff list
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete staff member",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = () => {
    show({
      title: "Delete Staff Member",
      description: `Are you sure you want to delete "${row.original.firstName} ${row.original.lastName}"? This action cannot be undone.`,
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

export const staffColumns: ColumnDef<UserShowResponse, any>[] = [
  columnHelper.accessor("id", {
    header: "ID",
    cell: ({ row }) => <IdDisplay id={row.original.id} />,
  }),

  columnHelper.display({
    id: "name",
    header: "Name",
    cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
  }),

  columnHelper.accessor("email", {
    header: "Email",
    cell: ({ row }) => row.original.email,
  }),

  columnHelper.accessor("rolesSlugs", {
    header: "Roles",
    cell: ({ row }) => row.original.rolesSlugs.join(", ") || "-",
  }),

  columnHelper.accessor("isActive", {
    header: "Status",
    cell: ({ row }) => {
      const statusKey = row.original.isActive.toString();
      const color = UserStatusBadgeColor[statusKey] || "bg-gray-600 hover:bg-gray-700";
      const label = UserStatusText[statusKey] || (row.original.isActive ? "Active" : "Inactive");
      
      return (
        <Badge variant="secondary" className={`text-white ${color}`}>
          {label}
        </Badge>
      );
    },
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
