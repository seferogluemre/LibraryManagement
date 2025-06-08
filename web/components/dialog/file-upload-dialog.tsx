import { Button } from "#components/ui/button";
import { DialogFooter } from "#components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "#components/ui/form";
import { Input } from "#components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#components/ui/select";
import { toast } from "#hooks/use-toast";
import { FileLibraryAssetShowResponse } from "@onlyjs/api";
import { IconUpload } from "@tabler/icons-react";
import { useForm } from "react-hook-form";

// File type options based on the API enum
const FILE_TYPE_OPTIONS: {
  value: FileLibraryAssetShowResponse["type"];
  label: string;
  description: string;
  accept: string;
}[] = [
  {
    value: "SPECIFICATION_DOCUMENT",
    label: "Specification Document",
    description: "Technical specifications and documentation",
    accept: ".pdf",
  },
  {
    value: "ADDITIONAL_DOCUMENT",
    label: "Additional Document",
    description: "Supporting documents and attachments",
    accept: ".pdf",
  },
  {
    value: "RFQ_PRODUCT_QUOTE_DOCUMENT",
    label: "RFQ Product Quote Document",
    description: "Request for quotation documents",
    accept: ".pdf",
  },
];

interface FileUploadDialogProps {
  onSuccess?: (file: File, type: FileLibraryAssetShowResponse["type"]) => void;
  onClose: () => void;
  defaultType?: FileLibraryAssetShowResponse["type"];
  requiredType?: FileLibraryAssetShowResponse["type"]; // Force a specific type and disable selection
  availableTypes?: FileLibraryAssetShowResponse["type"][]; // Limit which types are available
  title?: string;
  description?: string;
  disabled?: boolean; // Disable the entire form
}

type FileUploadFormData = {
  file: FileList;
  type: FileLibraryAssetShowResponse["type"];
};

export function FileUploadDialog({
  onSuccess,
  onClose,
  defaultType = "ADDITIONAL_DOCUMENT",
  requiredType,
  availableTypes,
  title = "Upload File",
  description = "Upload a document to the file library.",
  disabled = false,
}: FileUploadDialogProps) {
  // Determine the effective type to use
  const effectiveType = requiredType || defaultType;

  // Filter available types based on props
  const filteredTypeOptions = FILE_TYPE_OPTIONS.filter((option) => {
    if (requiredType) {
      return option.value === requiredType;
    }
    if (availableTypes) {
      return availableTypes.includes(option.value);
    }
    return true;
  });

  const form = useForm<FileUploadFormData>({
    defaultValues: {
      type: effectiveType,
    },
  });

  const selectedType = form.watch("type");
  const selectedTypeConfig = FILE_TYPE_OPTIONS.find(
    (option) => option.value === selectedType,
  );

  // Disable type selection if required type is set or if disabled
  const isTypeSelectionDisabled = !!requiredType || disabled;

  const onSubmit = async (data: FileUploadFormData) => {
    if (disabled) {
      toast({
        title: "Upload Disabled",
        description: "File upload is currently disabled.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (!data.file || data.file.length === 0) {
        toast({
          title: "Validation Error",
          description: "Please select a file to upload.",
          variant: "destructive",
        });
        return;
      }

      const file = data.file[0];

      form.reset({
        type: effectiveType,
      });

      onSuccess?.(file, data.type);
      onClose();
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Error",
        description:
          "An error occurred while uploading the file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    form.reset({
      type: effectiveType,
    });
    onClose();
  };

  // Show message if no types are available
  if (filteredTypeOptions.length === 0) {
    return (
      <div className="space-y-4 py-4">
        <div className="text-center text-muted-foreground">
          <p>No file types are available for upload at this time.</p>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Close
          </Button>
        </DialogFooter>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Document Type*
                {requiredType && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    (Required)
                  </span>
                )}
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isTypeSelectionDisabled}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {filteredTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {option.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {requiredType && (
                <p className="text-xs text-muted-foreground">
                  This document type is required for this context.
                </p>
              )}
              {availableTypes && !requiredType && (
                <p className="text-xs text-muted-foreground">
                  Only certain document types are available for this context.
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>File*</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept={selectedTypeConfig?.accept || ".pdf"}
                  onChange={(e) => onChange(e.target.files)}
                  disabled={disabled}
                  {...field}
                />
              </FormControl>
              {selectedTypeConfig && (
                <p className="text-xs text-muted-foreground">
                  Accepted formats: {selectedTypeConfig.accept.toUpperCase()} •
                  Max size: 1GB
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={disabled}>
            <IconUpload className="mr-2 h-4 w-4" />
            {disabled ? "Upload Disabled" : "Upload"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
