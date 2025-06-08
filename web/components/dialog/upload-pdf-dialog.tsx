import { Button } from "#components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#components/ui/dialog";
import { Input } from "#components/ui/input";
import { Label } from "#components/ui/label";

interface UploadPDFDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadPDFDialog({
  open,
  onOpenChange,
}: UploadPDFDialogProps) {
  const handleUpload = () => {
    const fileInput = document.getElementById(
      "category-pdf-file",
    ) as HTMLInputElement;
    
    if (fileInput && fileInput.files && fileInput.files[0]) {
      const newFile = fileInput.files[0];
      console.log("Uploading PDF file:", newFile.name);
      onOpenChange(false);
    } else {
      console.log("No PDF file selected for upload");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload PDF</DialogTitle>
          <DialogDescription>
            Please upload a specification. PDF files are accepted.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="category-pdf-file">File</Label>
            <Input
              id="category-pdf-file"
              name="category-pdf-file"
              type="file"
              accept=".pdf"
              className="bg-background text-foreground"
            />
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpload}>Upload</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 