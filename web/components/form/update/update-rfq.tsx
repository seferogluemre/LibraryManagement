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
import { RfqShowResponse, rfqUpdateDto, RfqUpdatePayload } from "@onlyjs/api";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export function UpdateRfqForm({
  onSuccess,
  rfqData,
  onClose,
}: {
  onSuccess?: () => void;
  rfqData: RfqShowResponse;
  onClose?: () => void;
}) {
  const queryClient = useQueryClient();
  const form = useForm<RfqUpdatePayload>({
    resolver: typeboxResolver(rfqUpdateDto.body),
    defaultValues: {
      name: "",
    },
  });

  // Set form values when rfqData changes
  useEffect(() => {
    if (rfqData) {
      form.reset({
        name: rfqData.name || "",
      });
    }
  }, [rfqData, form]);

  const onSubmit = async (data: RfqUpdatePayload) => {
    try {
      const response = await api.rfq({ uuid: rfqData.uuid }).put(data);
      if (response.data) {
        toast({
          title: "Success",
          description: "RFQ updated successfully",
        });
        queryClient.invalidateQueries({ queryKey: ["rfqs"] });
        onSuccess?.();
      } else {
        const errorMessage = response.error
          ? typeof response.error === "object" && "message" in response.error
            ? (response.error as any).message
            : "Unknown error"
          : "RFQ could not be updated";

        toast({
          title: "Error",
          description: "RFQ update failed: " + errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating RFQ:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating the RFQ. Please try again.",
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
              <FormLabel>RFQ Name*</FormLabel>
              <FormControl>
                <Input placeholder="Enter RFQ name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Updating..." : "Update RFQ"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 