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
import { ContactShowResponse, contactUpdateDto, ContactUpdatePayload } from "@onlyjs/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
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

export function UpdateContactForm({
  onSuccess,
  contactData,
  onClose,
}: {
  onSuccess?: () => void;
  contactData: ContactShowResponse;
  onClose?: () => void;
}) {
  const queryClient = useQueryClient();

  const form = useForm<ContactUpdatePayload>({
    resolver: typeboxResolver(contactUpdateDto.body),
    defaultValues: {
      name: "",
      type: "GENERAL",
      email: "",
      phone: "",
      title: "",
      companyUuid: "",
    },
  });

  const { data: companies = [], isLoading: isLoadingCompanies } = useQuery({
    queryKey: ["companies"],
    queryFn: getCompanies,
  });

  // Set form values when contactData or companies change
  useEffect(() => {
    if (contactData) {
      const formData = {
        name: contactData.name || "",
        type: contactData.type || "GENERAL",
        email: contactData.email || "",
        phone: contactData.phone || "",
        title: contactData.title || "",
        companyUuid: contactData.company?.uuid || "",
      };
      
      form.reset(formData);
    }
  }, [contactData, companies, form]);

  const onSubmit = async (data: ContactUpdatePayload) => {
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

      const response = await api.contacts({ uuid: contactData.uuid }).put(data);

      if (response.data) {
        toast({
          title: "Success",
          description: "Contact updated successfully",
        });
        queryClient.invalidateQueries({ queryKey: ["contacts"] });
        onSuccess?.();
      } else {
        const errorMessage = response.error
          ? typeof response.error === "object" && "message" in response.error
            ? (response.error as any).message
            : "Unknown error"
          : "Contact could not be updated";

        toast({
          title: "Error",
          description: "Contact update failed: " + errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating contact:", error);
      toast({
        title: "Error",
        description:
          "An error occurred while updating the contact. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form 
        key={contactData.uuid} 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-6"
      >
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
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select contact type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="GENERAL">General</SelectItem>
                  <SelectItem value="PROJECT_MANAGER">Project Manager</SelectItem>
                  <SelectItem value="AUTHORIZED_PERSON">Authorized Person</SelectItem>
                </SelectContent>
              </Select>
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
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
                defaultValue={field.value}
                disabled={isLoadingCompanies}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingCompanies ? "Loading companies..." : "Select a company"} />
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
            {form.formState.isSubmitting ? "Updating..." : "Update Contact"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 