import { Button } from "#components/ui/button";
import { DialogFooter } from "#components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "#components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#components/ui/select";
import { toast } from "#hooks/use-toast.js";
import { api } from "#lib/api.js";
import { typeboxResolver } from "#lib/resolver.js";
import {
  projectCategoryCreateDto,
  ProjectCategoryCreatePayload,
} from "@onlyjs/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

interface Props {
  onOpenChange: (open: boolean) => void;
  projectUuid: string;
}

export function CreateProjectCategoryDialog({
  onOpenChange,
  projectUuid,
}: Props) {
  const queryClient = useQueryClient();
  const form = useForm<ProjectCategoryCreatePayload>({
    resolver: typeboxResolver(projectCategoryCreateDto.body),
    defaultValues: {
      productCategoryUuid: "",
      projectUuid,
    },
  });

  const {
    data: productCategories = {
      data: [],
    },
    isLoading: isLoadingCategories,
  } = useQuery({
    queryKey: ["product-categories"],
    queryFn: () => getProductCategories(),
  });

  const handleSubmit = async (data: ProjectCategoryCreatePayload) => {
    if (!data.productCategoryUuid) {
      toast({
        title: "Please select a product category",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await api["project-category"].index.post({
        projectUuid,
        productCategoryUuid: data.productCategoryUuid,
      });

      if (response.data) {
        toast({
          title: "Project category created successfully",
        });
        form.reset();
        queryClient.invalidateQueries({ queryKey: ["project-categories", projectUuid] });
        onOpenChange(false);
      } else {
        toast({
          title: "Failed to create project category",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating project category:", error);
      toast({
        title: "An error occurred while creating the project category",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="py-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="productCategoryUuid"
              rules={{ required: "Please select a product category" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Category*</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingCategories}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isLoadingCategories
                              ? "Loading categories..."
                              : "Select a product category"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {productCategories.data.map((productCategory) => (
                        <SelectItem
                          key={productCategory.uuid}
                          value={productCategory.uuid}
                        >
                          {productCategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  form.formState.isSubmitting ||
                  !form.watch("productCategoryUuid") ||
                  isLoadingCategories
                }
              >
                {form.formState.isSubmitting
                  ? "Creating..."
                  : "Create Project Category"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </div>
    </>
  );
}

async function getProductCategories() {
  const response = await api["product-category"].index.get({
    query: {},
  });
  if (response.data) {
    return response.data;
  }
  return {
    data: [],
    meta: {
      page: 1,
      perPage: 10,
      total: 0,
      pageCount: 0,
    },
  };
}
