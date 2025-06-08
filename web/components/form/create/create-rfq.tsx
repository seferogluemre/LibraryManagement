import { Button } from "#components/ui/button";
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
import { toast } from "#hooks/use-toast";
import { api } from "#lib/api";
import { typeboxResolver } from "#lib/resolver.js";
import { rfqCreateDto, RfqCreatePayload } from "@onlyjs/api";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";

interface CreateRfqFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
  projectUuid: string;
  projectCategoryUuid: string;
}

// Helper function to fetch suppliers
async function getSuppliers() {
  const response = await api.company.index.get({
    query: {
      type: "SUPPLIER",
      perPage: 100, // Get more suppliers for selection
    },
  });

  if (response.data) {
    return response.data.data;
  }
  return [];
}

export function CreateRfqForm({
  onSuccess,
  onClose,
  projectUuid,
  projectCategoryUuid,
}: CreateRfqFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<RfqCreatePayload>({
    resolver: typeboxResolver(rfqCreateDto.body),
    defaultValues: {
      categorySupplierPairs: [
        {
          supplierUuid: "",
          projectCategoryUuid,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "categorySupplierPairs",
  });

  // Fetch suppliers
  const { data: suppliers = [] } = useQuery({
    queryKey: ["suppliers"],
    queryFn: getSuppliers,
  });

  const onSubmit = async (data: RfqCreatePayload) => {
    try {
      const response = await api.rfq.index.post(data);

      if (response.data) {
        toast({
          title: "Success",
          description: `Successfully created ${response.data.length} RFQ(s)`,
        });

        form.reset();

        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ["rfqs"] });
        if (projectUuid) {
          queryClient.invalidateQueries({
            queryKey: ["project-rfqs", projectUuid],
          });
        }

        onSuccess?.();
      } else {
        const errorMessage = response.error
          ? typeof response.error === "object" && "message" in response.error
            ? (response.error as any).message
            : "Unknown error"
          : "RFQ could not be created";

        toast({
          title: "Error",
          description: "RFQ creation failed: " + errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating RFQ:", error);
      toast({
        title: "Error",
        description:
          "An error occurred while creating the RFQ. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addSupplier = () => {
    append({
      supplierUuid: "",
      projectCategoryUuid,
    });
  };

  const removeSupplier = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Suppliers</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSupplier}
            >
              <IconPlus className="mr-2 h-4 w-4" />
              Add Supplier
            </Button>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="relative flex items-center gap-4 rounded-lg border p-4"
            >
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2 h-8 w-8 p-0 text-destructive hover:text-destructive"
                  onClick={() => removeSupplier(index)}
                >
                  <IconTrash className="h-4 w-4" />
                </Button>
              )}

              <FormField
                control={form.control}
                name={`categorySupplierPairs.${index}.supplierUuid`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Supplier*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select supplier" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.uuid} value={supplier.uuid}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="submit">
            Create RFQ{fields.length > 1 ? "s" : ""}
          </Button>
        </div>
      </form>
    </Form>
  );
}
