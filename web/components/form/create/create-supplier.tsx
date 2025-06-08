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
import { companyCreateDto, CompanyCreatePayload } from "@onlyjs/api";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

export function CreateSupplierForm({ 
  onSuccess,
  onClose 
}: { 
  onSuccess?: () => void;
  onClose?: () => void;
}) {
  const queryClient = useQueryClient();
  const form = useForm<CompanyCreatePayload>({
    resolver: typeboxResolver(companyCreateDto.body),
    defaultValues: {
      name: "",
      type: "SUPPLIER",
      description: "",
      authorizedForRfqs: "",
    },
  });

  const onSubmit = async (data: CompanyCreatePayload) => {
    try {
      const response = await api.company.index.post(data);
      if (response.data) {
        toast({
          title: "Success",
          description: "Supplier created successfully",
        });
        form.reset();
        queryClient.invalidateQueries({ queryKey: ["companies"] });
        onSuccess?.();
      } else {
        const errorMessage = response.error
          ? typeof response.error === "object" && "message" in response.error
            ? (response.error as any).message
            : "Unknown error"
          : "Supplier could not be created";

        toast({
          title: "Error",
          description: "Supplier creation failed: " + errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating supplier:", error);
      toast({
        title: "Error",
        description: "An error occurred while creating the supplier. Please try again.",
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
            {form.formState.isSubmitting ? "Creating..." : "Create Supplier"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
