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
import { VesselClassShowResponse, vesselClassUpdateDto, VesselClassUpdatePayload } from "@onlyjs/api";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export function UpdateVesselClassForm({
  onSuccess,
  vesselClassData,
  onClose,
}: {
  onSuccess?: () => void;
  vesselClassData: VesselClassShowResponse;
  onClose?: () => void;
}) {
  const queryClient = useQueryClient();
  const form = useForm<VesselClassUpdatePayload>({
    resolver: typeboxResolver(vesselClassUpdateDto.body),
    defaultValues: {
      name: "",
    },
  });

  // Set form values when vesselClassData changes
  useEffect(() => {
    if (vesselClassData) {
      form.reset({
        name: vesselClassData.name || "",
      });
    }
  }, [vesselClassData, form]);

  const onSubmit = async (data: VesselClassUpdatePayload) => {
    try {
      const response = await api["vessel-class"]({ uuid: vesselClassData.uuid }).put(data);
      if (response.data) {
        toast({
          title: "Success",
          description: "Vessel class updated successfully",
        });
        queryClient.invalidateQueries({ queryKey: ["vessel-classes"] });
        onSuccess?.();
      } else {
        const errorMessage = response.error
          ? typeof response.error === "object" && "message" in response.error
            ? (response.error as any).message
            : "Unknown error"
          : "Vessel class could not be updated";

        toast({
          title: "Error",
          description: "Vessel class update failed: " + errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating vessel class:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating the vessel class. Please try again.",
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
              <FormLabel>Vessel Class Name*</FormLabel>
              <FormControl>
                <Input placeholder="Enter vessel class name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Updating..." : "Update Vessel Class"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 