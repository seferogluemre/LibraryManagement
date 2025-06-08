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
import { VesselTypeCreatePayload, vesselTypeCreateDto } from "@onlyjs/api";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

export function CreateVesselTypeForm({ 
  onSuccess,
  onClose 
}: { 
  onSuccess?: () => void;
  onClose?: () => void;
}) {
  const queryClient = useQueryClient();
  const form = useForm<VesselTypeCreatePayload>({
    resolver: typeboxResolver(vesselTypeCreateDto.body),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: VesselTypeCreatePayload) => {
    try {
      const response = await api["vessel-types"].index.post(data);
      if (response.data) {
        toast({
          title: "Success",
          description: "Vessel type created successfully",
        });
        form.reset();
        queryClient.invalidateQueries({ queryKey: ["vessel-types"] });
        onSuccess?.();
      } else {
        const errorMessage = response.error
          ? typeof response.error === "object" && "message" in response.error
            ? (response.error as any).message
            : "Unknown error"
          : "Vessel type could not be created";

        toast({
          title: "Error",
          description: "Vessel type creation failed: " + errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating vessel type:", error);
      toast({
        title: "Error",
        description: "An error occurred while creating the vessel type. Please try again.",
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
            {form.formState.isSubmitting ? "Creating..." : "Create Vessel Type"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 