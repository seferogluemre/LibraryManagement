import { Button } from "#components/ui/button.js";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "#components/ui/form.js";
import { Input } from "#components/ui/input.js";
import { Textarea } from "#components/ui/textarea.js";
import { toast } from "#hooks/use-toast.js";
import { api } from "#lib/api.js";
import { typeboxResolver } from "#lib/resolver.js";
import { companyCreateDto, CompanyCreatePayload, CompanyUpdatePayload } from "@onlyjs/api";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

export function CreateShipyardForm({
  onSuccess,
  shipyardToEdit,
  onClose,
}: {
  onSuccess?: () => void;
  shipyardToEdit?: ShipyardToEdit;
  onClose?: () => void;
}) {
  const isEditMode = !!shipyardToEdit;
  const queryClient = useQueryClient();

  const form = useForm<CompanyUpdatePayload>({
    resolver: typeboxResolver(companyCreateDto.body),
    defaultValues: {
      name: shipyardToEdit?.name || "",
      type: "SHIPYARD",
      description: shipyardToEdit?.description || "",
      authorizedForRfqs: shipyardToEdit?.authorizedForRfqs || "",
      suppliedCategories: [],
    },
  });

  const onSubmit = async (data: CompanyUpdatePayload) => {
    try {
      if (isEditMode && shipyardToEdit) {
        const response = await api
          .company({ uuid: shipyardToEdit.id })
          .put(data);

        if (response.data) {
          toast({
            title: "Success",
            description: "Shipyard updated successfully",
          });
          form.reset();
          queryClient.invalidateQueries({ queryKey: ["companies"] });
          onSuccess?.();
        } else {
          const errorMessage = response.error
            ? typeof response.error === "object" && "message" in response.error
              ? (response.error as any).message
              : "Unknown error"
            : "Shipyard could not be updated";

          toast({
            title: "Error",
            description: "Shipyard update failed: " + errorMessage,
            variant: "destructive",
          });
        }
      } else {
        // For create, we need to use CompanyCreatePayload
        const createData: CompanyCreatePayload = {
          name: data.name!,
          type: data.type!,
          description: data.description || undefined,
          authorizedForRfqs: data.authorizedForRfqs || undefined,
        };
        
        const response = await api.company.index.post(createData);

        if (response.data) {
          toast({
            title: "Success",
            description: "Shipyard created successfully",
          });
          form.reset();
          queryClient.invalidateQueries({ queryKey: ["companies"] });
          onSuccess?.();
        } else {
          const errorMessage = response.error
            ? typeof response.error === "object" && "message" in response.error
              ? (response.error as any).message
              : "Unknown error"
            : "Shipyard could not be created";

          toast({
            title: "Error",
            description: "Shipyard creation failed: " + errorMessage,
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      console.error("Error saving shipyard:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "An error occurred while saving the shipyard",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shipyard Name*</FormLabel>
              <FormControl>
                <Input placeholder="Enter shipyard name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter shipyard description"
                  {...field}
                  value={field.value || ""}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="authorizedForRfqs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Authorized for RFQs</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter authorization details for RFQs"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
                ? "Update Shipyard"
                : "Create Shipyard"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

interface ShipyardToEdit {
  id: string;
  name: string;
  description?: string;
  authorizedForRfqs?: string;
}
