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
import {
  CompanyShowResponse,
  companyUpdateDto,
  CompanyUpdatePayload,
} from "@onlyjs/api";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export function UpdateSupplierForm({
  onSuccess,
  supplierData,
  onClose,
}: {
  onSuccess?: () => void;
  supplierData: CompanyShowResponse;
  onClose?: () => void;
}) {
  const queryClient = useQueryClient();
  const form = useForm<CompanyUpdatePayload>({
    resolver: typeboxResolver(companyUpdateDto.body),
    defaultValues: {
      name: "",
      type: "SUPPLIER",
      description: "",
      authorizedForRfqs: "",
      suppliedCategories: [],
    },
  });

  // Set form values when supplierData changes
  useEffect(() => {
    if (supplierData) {
      form.reset({
        name: supplierData.name || "",
        type: "SUPPLIER",
        description: supplierData.description || "",
        authorizedForRfqs: supplierData.authorizedForRfqs || "",
        suppliedCategories: supplierData.suppliedCategories || [],
      });
    }
  }, [supplierData, form]);

  const onSubmit = async (data: CompanyUpdatePayload) => {
    try {
      const response = await api.company({ uuid: supplierData.uuid }).put(data);
      if (response.data) {
        toast({
          title: "Success",
          description: "Supplier updated successfully",
        });
        queryClient.invalidateQueries({ queryKey: ["companies"] });
        onSuccess?.();
      } else {
        const errorMessage = response.error
          ? typeof response.error === "object" && "message" in response.error
            ? (response.error as any).message
            : "Unknown error"
          : "Supplier could not be updated";

        toast({
          title: "Error",
          description: "Supplier update failed: " + errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating supplier:", error);
      toast({
        title: "Error",
        description:
          "An error occurred while updating the supplier. Please try again.",
        variant: "destructive",
      });
    }
  };
  console.log(form.formState.errors);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supplier Name*</FormLabel>
              <FormControl>
                <Input placeholder="Enter supplier name" {...field} />
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
                  placeholder="Enter supplier description"
                  {...field}
                  value={field.value || ""}
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
            {form.formState.isSubmitting ? "Updating..." : "Update Supplier"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
