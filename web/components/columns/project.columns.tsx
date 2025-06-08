import { FileUploadDialog } from "#components/dialog/file-upload-dialog.js";
import { UpdateProjectForm } from "#components/form/update/update-project.js";
import { IdDisplay } from "#components/id-display";
import { Badge } from "#components/ui/badge";
import { Button } from "#components/ui/button.js";
import { StatusBadgeColor, StatusText } from "#constant/project";
import { useFormDialogs } from "#hooks/use-form-dialogs.js";
import { toast } from "#hooks/use-toast.js";
import { api } from "#lib/api.js";
import { asset } from "#lib/asset.js";
import { useConfirmationDialog } from "#store/use-confirmation-dialog.js";
import { ProjectShowResponse } from "@onlyjs/api";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  DownloadIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UploadIcon,
} from "lucide-react";

const columnHelper = createColumnHelper<ProjectShowResponse>();

const RowActions = ({ row }: { row: { original: ProjectShowResponse } }) => {
  const { openForm } = useFormDialogs();
  const { show } = useConfirmationDialog();
  const queryClient = useQueryClient();

  const handleEdit = () => {
    openForm(
      "Edit Project",
      (onClose) => (
        <UpdateProjectForm
          projectData={row.original}
          onClose={onClose}
          onSuccess={() => {
            // Refresh all project lists
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            onClose();
          }}
        />
      ),
      "xl",
    );
  };

  const handleDelete = async () => {
    try {
      const response = await api.projects({ uuid: row.original.uuid }).delete();

      if (response.error) {
        toast({
          title: "Error",
          description: "Failed to delete project",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Project deleted successfully",
      });

      // Refresh all project lists
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = () => {
    show({
      title: "Delete Project",
      description: `Are you sure you want to delete "${row.original.name}"? This action cannot be undone.`,
      approveText: "Delete",
      rejectText: "Cancel",
      onApprove: handleDelete,
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button  variant="outline" title="View" asChild>
        <Link to="/projects/$id" params={{ id: row.original.uuid }}>
          <EyeIcon className="size-4" />
          Details
        </Link>
      </Button>
      <Button size="icon" variant="outline" title="Edit" onClick={handleEdit}>
        <PencilIcon className="size-4" />
      </Button>
      <Button
        size="icon"
        variant="outline"
        title="Delete"
        className="text-destructive"
        onClick={confirmDelete}
      >
        <TrashIcon className="size-4" />
      </Button>
    </div>
  );
};

const SpecificationCell = ({
  row,
}: {
  row: { original: ProjectShowResponse };
}) => {
  const { openForm } = useFormDialogs();
  const queryClient = useQueryClient();

  const handleUpload = () => {
    openForm(
      "Upload Specification",
      (onClose) => (
        <FileUploadDialog
          requiredType="SPECIFICATION_DOCUMENT"
          onClose={onClose}
          onSuccess={async (file: File) => {
            try {
              const response = await api
                .projects({ uuid: row.original.uuid })
                .put({
                  specificationDocFile: file,
                  specificationDocType: "SPECIFICATION_DOCUMENT",
                });

              if (response.data) {
                toast({
                  title: "Success",
                  description: "Specification uploaded successfully",
                });
                // Refresh all project lists
                queryClient.invalidateQueries({ queryKey: ["projects"] });
                onClose();
              } else {
                toast({
                  title: "Error",
                  description: "Failed to upload specification",
                  variant: "destructive",
                });
              }
            } catch (error) {
              toast({
                title: "Error",
                description: "Failed to upload specification",
                variant: "destructive",
              });
            }
          }}
        />
      ),
      "lg",
    );
  };

  const handleDownload = () => {
    if (row.original.specificationDocSrc) {
      const downloadUrl = asset(row.original.specificationDocSrc);
      window.open(downloadUrl, "_blank");
    }
  };

  if (row.original.specificationDocSrc) {
    return (
      <Button size="sm" variant="outline" onClick={handleDownload}>
        <DownloadIcon className="mr-2 h-4 w-4" />
        Download
      </Button>
    );
  }

  return (
    <Button size="sm" variant="outline" onClick={handleUpload}>
      <UploadIcon className="mr-2 h-4 w-4" />
      Upload
    </Button>
  );
};

export const projectColumns: () => ColumnDef<
  ProjectShowResponse,
  any
>[] = () => [
  columnHelper.accessor("uuid", {
    header: "ID",
    cell: ({ row }) => <IdDisplay id={row.original.uuid} />,
  }),
  columnHelper.accessor("name", {
    header: "Project Name",
    cell: ({ row }) => row.original.name,
  }),
  columnHelper.accessor("shipyardUuid", {
    id: "shipyard",
    header: "Shipyard",
    cell: ({ row }) => row.original.shipyard?.name,
  }),
  columnHelper.accessor("vesselTypeUuid", {
    id: "vesselType",
    header: "Vessel Type",
    cell: ({ row }) => row.original.vesselType?.name,
  }),
  columnHelper.accessor("projectManagerUuid", {
    id: "projectManager",
    header: "Project Manager",
    cell: ({ row }) => row.original.projectManager?.name,
  }),
  columnHelper.accessor("status", {
    header: "Project Status",
    cell: ({ row }) => <ProjectStatusBadge status={row.original.status} />,
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
    id: "specification",
    header: "Specification",
    cell: ({ row }) => <SpecificationCell row={row} />,
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <RowActions row={row} />,
  }),
];

function ProjectStatusBadge({ status }: { status: string }) {
  const color =
    StatusBadgeColor[status as keyof typeof StatusBadgeColor] ||
    "bg-gray-600 hover:bg-gray-700";
  const label = StatusText[status as keyof typeof StatusText] || status;

  return (
    <Badge variant="secondary" className={`text-white ${color}`}>
      {label}
    </Badge>
  );
}
