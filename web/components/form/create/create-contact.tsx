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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#components/ui/select.js";
import { toast } from "#hooks/use-toast.js";
import { api } from "#lib/api.js";
import { typeboxResolver } from "#lib/resolver.js";
import { ContactCreatePayload, contactCreateDto } from "@onlyjs/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

async function getCompanies() {
  const response = await api.company.index.get({
    query: {},
  });

  if (response.data) {
    return response.data.data;
  }

  return [];
}

export function CreateContactForm({
  onSuccess,
  defaultCompanyUuid,
  onClose,
}: {
  onSuccess?: () => void;
  defaultCompanyUuid?: string;
  onClose?: () => void;
}) {
  const queryClient = useQueryClient();

  const form = useForm<ContactCreatePayload>({
    defaultValues: {
      name: "",
      type: "GENERAL",
      email: "",
      phone: "",
      title: "",
      companyUuid: defaultCompanyUuid || "",
    },
    resolver: typeboxResolver(contactCreateDto.body),
  },);

  const { data: companies = [] } = useQuery({
    queryKey: ["companies"],
    queryFn: getCompanies,
  });

  const onSubmit = async (data: ContactCreatePayload) => {
    try {
      // Required fields validation
      if (!data.name) {
        toast({
          title: "Error",
          description: "Contact name is required",
          variant: "destructive",
        });
        return;
      }

      const response = await api.contacts.index.post(data);

      if (response.data) {
        toast({
          title: "Success",
          description: "Contact created successfully",
        });
        form.reset();
        queryClient.invalidateQueries({ queryKey: ["contacts"] });
        onSuccess?.();
      } else {
        const errorMessage = response.error
          ? typeof response.error === "object" && "message" in response.error
            ? (response.error as any).message
            : "Unknown error"
          : "Contact could not be created";

        toast({
          title: "Error",
          description: "Contact creation failed: " + errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating contact:", error);
      toast({
        title: "Error",
        description:
          "An error occurred while creating the contact. Please try again.",
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
              <FormLabel>Contact Name*</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter contact name"
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Type</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select contact type" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="GENERAL">General</SelectItem>
                    <SelectItem value="PROJECT_MANAGER">Project Manager</SelectItem>
                    <SelectItem value="AUTHORIZED_PERSON">Authorized Person</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter email address"
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
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="Enter phone number"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter job title"
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
          name="companyUuid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.uuid} value={company.uuid}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Creating..." : "Create Contact"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
