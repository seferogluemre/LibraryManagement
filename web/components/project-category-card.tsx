import { CreateRfqForm } from "#components/form/create/create-rfq.js";
import { useFormDialogs } from "#hooks/use-form-dialogs.js";
import { toast } from "#hooks/use-toast.js";
import { api } from "#lib/api.js";
import { asset } from "#lib/asset.js";
import { ProjectCategoryShowResponse, RfqShowResponse } from "@onlyjs/api";
import { IconFileUpload, IconListDetails, IconPlus } from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Eye, FileText, MessagesSquare } from "lucide-react";
import { PDFViewerDialog, RFQDetailDialog } from "./dialog";
import { FileUploadDialog } from "./dialog/file-upload-dialog";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function ProjectCategoryCard({ projectCategory }: Props) {
  const { openForm } = useFormDialogs();
  const queryClient = useQueryClient();

  function openEditCategoryDialog(rfq: RfqShowResponse) {
    openForm(rfq.name, (onClose) => (
      <RFQDetailDialog 
        open={true}
        onOpenChange={(open) => !open && onClose()}
        rfq={rfq}
      />
    ));
  }

  function handleUploadAdditionalFile() {
    openForm("Upload Additional File", (onClose) => (
      <FileUploadDialog
        requiredType="ADDITIONAL_DOCUMENT"
        onClose={onClose}
        onSuccess={async (file: File) => {
          const response = await api["project-category"]({
            uuid: projectCategory.uuid,
          })["upload-file"].post({
            additionalDocFile: file,
            additionalDocType: "ADDITIONAL_DOCUMENT",
          });
          if (response.data) {
            toast({
              title: "File uploaded successfully",
            });
          } else {
            toast({
              title: "Failed to upload file",
            });
          }
          queryClient.invalidateQueries({
            queryKey: ["project-categories", projectCategory.projectUuid],
          });
          onClose();
        }}
      />
    ));
  }

  function handleCreateRFQ() {
    openForm(
      "Create RFQ",
      (onClose) => (
        <CreateRfqForm
          projectUuid={projectCategory.projectUuid}
          projectCategoryUuid={projectCategory.uuid}
          onClose={onClose}
          onSuccess={() => {
            // Refresh the RFQs list for this project
            queryClient.invalidateQueries({
              queryKey: ["project-rfq", projectCategory.projectUuid],
            });
            onClose();
          }}
        />
      ),
      "lg"
    );
  }

  function handleViewPdf(filePath: string) {
    openForm("View PDF", (onClose) => (
      <PDFViewerDialog 
        pdfUrl={asset(filePath)}
      />
    ));
  }

  const { data: rfqs } = useQuery({
    queryKey: [
      "project-rfq",
      projectCategory.projectUuid,
      projectCategory.uuid,
    ],
    queryFn: () =>
      getProjectRfq(projectCategory.projectUuid, projectCategory.uuid),
  });

  return (
    <>
      <Card className="flex w-full flex-col overflow-hidden">
        <CardHeader className="flex-shrink-0 bg-muted/30 pb-2">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg">
              {projectCategory.productCategory.name}
            </CardTitle>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleUploadAdditionalFile}
              >
                <IconFileUpload className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow overflow-y-auto pt-3">
          {/* RFQ'lar bölümü - Kategori altında gösteriliyor - Tablo görünümü */}
          <div className="pt-1">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <IconListDetails className="h-4 w-4" />
                Request for Quotations (RFQ)
              </h3>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2"
                onClick={handleCreateRFQ}
              >
                <IconPlus className="mr-1 h-3.5 w-3.5" />
                Add
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              {rfqs?.data.map((rfq) => (
                <div
                  key={rfq.uuid}
                  className="flex items-center justify-between gap-2"
                >
                  {rfq.name}
                  <div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => openEditCategoryDialog(rfq)}
                    >
                      <Eye />
                    </Button>
                    {rfq.magicLink && (
                      <Button size="icon" variant="ghost" asChild>
                        <Link
                          to="/projects/$id/rfq"
                          params={{ id: rfq.projectUuid }}
                          search={{ rfqId: rfq.uuid }}
                        >
                          <MessagesSquare />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>

        {/* Additional Documents Footer */}
        {projectCategory.additionalDocs &&
          projectCategory.additionalDocs.length > 0 && (
            <CardFooter className="flex-col items-start gap-2 border-t bg-muted/20 pt-3">
              <h4 className="flex items-center gap-2 text-sm font-semibold">
                <FileText className="h-4 w-4" />
                Additional Documents
              </h4>
              <div className="flex w-full flex-wrap gap-2">
                {projectCategory.additionalDocs.map((doc) => (
                  <Button
                    key={doc.uuid}
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs"
                    onClick={() => handleViewPdf(doc.path)}
                  >
                    <FileText className="mr-1 h-3 w-3" />
                    {doc.name}
                  </Button>
                ))}
              </div>
            </CardFooter>
          )}
      </Card>
    </>
  );
}

interface Props {
  projectCategory: ProjectCategoryShowResponse;
}

async function getProjectRfq(projectUuid: string, projectCategoryUuid: string) {
  const response = await api.rfq.index.get({
    query: {
      projectUuid,
      projectCategoryUuid,
    },
  });
  if (response.data) return response.data;

  return {
    data: [],
    meta: {
      perPage: 0,
      total: 0,
      page: 0,
      pageCount: 0,
    },
  };
}
