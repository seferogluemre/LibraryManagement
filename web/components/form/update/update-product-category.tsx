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
import { ProductCategoryShowResponse, productCategoryUpdateDto, ProductCategoryUpdatePayload } from "@onlyjs/api";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export function UpdateProductCategoryForm({
  onSuccess,
  categoryData,
  onClose,
}: {
  onSuccess?: () => void;
  categoryData: ProductCategoryShowResponse;
  onClose?: () => void;
}) {
  const queryClient = useQueryClient();

  const form = useForm<ProductCategoryUpdatePayload>({
    resolver: typeboxResolver(productCategoryUpdateDto.body),
    defaultValues: {
      name: "",
    },
  });

  // Set form values when categoryData changes
  useEffect(() => {
    if (categoryData) {
      form.reset({
        name: categoryData.name || "",
      });
    }
  }, [categoryData, form]);

  const onSubmit = async (data: ProductCategoryUpdatePayload) => {
    try {
      await api["product-category"]({ uuid: categoryData.uuid }).put(data);

      toast({
        title: "Success",
        description: "Product category updated successfully",
      });

      // Invalidate and refetch product categories
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });

      // Call onSuccess callback
      onSuccess?.();
    } catch (error) {
      console.error("Error updating product category:", error);
      toast({
        title: "Error",
        description: "Failed to update product category",
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
            {form.formState.isSubmitting ? "Updating..." : "Update Category"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
