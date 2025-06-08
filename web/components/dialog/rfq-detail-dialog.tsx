import { Button } from "#components/ui/button";
import { DialogFooter } from "#components/ui/dialog";
import { RfqShowResponse } from "@onlyjs/api";
import { IconMessage } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";

interface RFQDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rfq: RfqShowResponse;
}

export function RFQDetailDialog({
  open,
  onOpenChange,
  rfq,
}: RFQDetailDialogProps) {
  return (
    <>
      <div className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <h3 className="mb-1 text-sm font-medium text-muted-foreground">
              Project
            </h3>
            <p className="text-base font-medium">{rfq.project?.name}</p>
          </div>
          <div>
            <h3 className="mb-1 text-sm font-medium text-muted-foreground">
              Supplier
            </h3>
            <p className="text-base font-medium">{rfq.supplier?.name}</p>
          </div>
          <div>
            <h3 className="mb-1 text-sm font-medium text-muted-foreground">
              Category
            </h3>
            <p className="text-base font-medium">{rfq.projectCategory?.name}</p>
          </div>
          <div>
            <h3 className="mb-1 text-sm font-medium text-muted-foreground">
              Creation Date
            </h3>
            <p className="text-base font-medium">
              {format(rfq.createdAt, "dd.MM.yyyy")}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-lg border bg-muted/30 p-4">
          <h3 className="mb-3 text-lg font-semibold">RFQ Details</h3>
          <p className="text-sm opacity-90">
            This RFQ contains price offers for {rfq.projectCategoryUuid}{" "}
            category, provided by {rfq.supplier?.name}.
          </p>
        </div>

        {rfq.magicLink && (
          <div className="mt-4 border-t pt-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="rounded-md"
                onClick={() => onOpenChange(false)}
                asChild
              >
                <Link to="/projects/$id/rfq" params={{ id: rfq.projectUuid }}>
                  <IconMessage className="mr-2 h-4 w-4" />
                  View Messages
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>

      <DialogFooter className="mt-4">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      </DialogFooter>
    </>
  );
}
