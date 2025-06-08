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
import { userCreateDto, UserCreatePayload } from "@onlyjs/api";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

export function CreateStaffForm({ 
  onSuccess,
  onClose 
}: { 
  onSuccess?: () => void;
  onClose?: () => void;
}) {
  const queryClient = useQueryClient();

  const form = useForm<UserCreatePayload>({
    resolver: typeboxResolver(userCreateDto.body),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      gender: "MALE",
      rolesSlugs: [],
    },
  });

  const onSubmit = async (data: UserCreatePayload) => {
    try {
      // Required fields validation
      if (!data.firstName || !data.lastName || !data.email || !data.password) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      const response = await api.users.post(data);

      if (response.data) {
        toast({
          title: "Success",
          description: "Staff member created successfully",
        });
        form.reset();
        queryClient.invalidateQueries({ queryKey: ["staff"] });
        onSuccess?.();
      } else {
        const errorMessage = response.error
          ? typeof response.error === "object" && "message" in response.error
            ? (response.error as any).message
            : "Unknown error"
          : "Staff member could not be created";

        toast({
          title: "Error",
          description: "Staff creation failed: " + errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating staff:", error);
      toast({
        title: "Error",
        description: "An error occurred while creating the staff member. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email*</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter email address"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password*</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Creating..." : "Create Staff Member"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
