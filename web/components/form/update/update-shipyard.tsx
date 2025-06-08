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

export function UpdateShipyardForm({
  onSuccess,
  shipyardData,
  onClose,
}: {
  onSuccess?: () => void;
  shipyardData: CompanyShowResponse;
  onClose?: () => void;
}) {
  const queryClient = useQueryClient();

  const form = useForm<CompanyUpdatePayload>({
    resolver: typeboxResolver(companyUpdateDto.body),
    defaultValues: {
      name: "",
      type: "SHIPYARD",
      description: "",
      authorizedForRfqs: "",
      suppliedCategories: [],
    },
  });

  // Set form values when shipyardData changes
  useEffect(() => {
    if (shipyardData) {
      form.reset({
        name: shipyardData.name || "",
        type: "SHIPYARD",
        description: shipyardData.description || "",
        authorizedForRfqs: shipyardData.authorizedForRfqs || "",
        suppliedCategories: shipyardData.suppliedCategories || [],
      });
    }
  }, [shipyardData, form]);

  const onSubmit = async (data: CompanyUpdatePayload) => {
    try {
      const response = await api.company({ uuid: shipyardData.uuid }).put(data);

      if (response.data) {
        toast({
          title: "Success",
          description: "Shipyard updated successfully",
        });
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
    } catch (error: any) {
      console.error("Error updating shipyard:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "An error occurred while updating the shipyard",
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
            {form.formState.isSubmitting ? "Updating..." : "Update Shipyard"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
