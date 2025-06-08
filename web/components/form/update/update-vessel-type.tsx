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
import { toast } from "#hooks/use-toast.js";
import { api } from "#lib/api.js";
import { typeboxResolver } from "#lib/resolver.js";
import {
  VesselTypeShowResponse,
  VesselTypeUpdatePayload,
  vesselTypeUpdateDto,
} from "@onlyjs/api";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export function UpdateVesselTypeForm({
  onSuccess,
  vesselTypeData,
  onClose,
}: {
  onSuccess?: () => void;
  vesselTypeData: VesselTypeShowResponse;
  onClose?: () => void;
}) {
  const queryClient = useQueryClient();
  const form = useForm<VesselTypeUpdatePayload>({
    resolver: typeboxResolver(vesselTypeUpdateDto.body),
    defaultValues: {
      name: "",
    },
  });

  // Set form values when vesselTypeData changes
  useEffect(() => {
    if (vesselTypeData) {
      form.reset({
        name: vesselTypeData.name || "",
      });
    }
  }, [vesselTypeData, form]);

  const onSubmit = async (data: VesselTypeUpdatePayload) => {
    try {
      const response = await api["vessel-types"]({
        uuid: vesselTypeData.uuid,
      }).put(data);
      if (response.data) {
        toast({
          title: "Success",
          description: "Vessel type updated successfully",
        });
        queryClient.invalidateQueries({ queryKey: ["vessel-types"] });
        onSuccess?.();
      } else {
        const errorMessage = response.error
          ? typeof response.error === "object" && "message" in response.error
            ? (response.error as any).message
            : "Unknown error"
          : "Vessel type could not be updated";

        toast({
          title: "Error",
          description: "Vessel type update failed: " + errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating vessel type:", error);
      toast({
        title: "Error",
        description:
          "An error occurred while updating the vessel type. Please try again.",
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
              <FormLabel>Vessel Type Name*</FormLabel>
              <FormControl>
                <Input placeholder="Enter vessel type name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Updating..." : "Update Vessel Type"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
