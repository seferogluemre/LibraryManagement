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
import { productCategoryCreateDto } from "@onlyjs/api";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

type ProductCategoryCreatePayload = {
  name: string;
};

export function CreateProductCategoryForm({ 
  onSuccess,
  onClose 
}: { 
  onSuccess?: () => void;
  onClose?: () => void;
}) {
  const queryClient = useQueryClient();

  const form = useForm<ProductCategoryCreatePayload>({
    resolver: typeboxResolver(productCategoryCreateDto.body),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: ProductCategoryCreatePayload) => {
    try {
      await api["product-category"].index.post(data);
      
      toast({
        title: "Success",
        description: "Product category created successfully",
      });

      // Invalidate and refetch product categories
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
      
      // Reset form
      form.reset();
      
      // Call onSuccess callback
      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.error("Error creating product category:", error);
      toast({
        title: "Error",
        description: "Failed to create product category",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name*</FormLabel>
              <FormControl>
                <Input placeholder="Enter category name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Creating..." : "Create Category"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 