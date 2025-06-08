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
import {
  ProjectShowResponse,
  projectUpdateDto,
  ProjectUpdatePayload,
} from "@onlyjs/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

async function getShipyards() {
  try {
    const response = await api.company.index.get({
      query: {
        type: "SHIPYARD",
      },
    });

    if (response.data) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching shipyards:", error);
    return [];
  }
}

async function getStaff() {
  try {
    const response = await api.users.get({
      query: {},
    });

    if (response.data) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching staff:", error);
    return [];
  }
}

async function getVesselTypes() {
  try {
    const response = await api["vessel-types"].index.get({
      query: {},
    });

    if (response.data) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching vessel types:", error);
    return [];
  }
}

async function getVesselClasses() {
  try {
    const response = await api["vessel-class"].index.get({
      query: {},
    });

    if (response.data) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching vessel classes:", error);
    return [];
  }
}

async function getContacts() {
  try {
    const response = await api.contacts.index.get({
      query: {},
    });

    if (response.data) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return [];
  }
}

export function UpdateProjectForm({
  onSuccess,
  projectData,
  onClose,
}: {
  onSuccess?: () => void;
  projectData: ProjectShowResponse;
  onClose?: () => void;
}) {
  const queryClient = useQueryClient();

  const form = useForm<ProjectUpdatePayload>({
    resolver: typeboxResolver(projectUpdateDto.body),
    defaultValues: {
      name: "",
      designer: "",
      shipOwner: "",
      staffId: "",
      vesselTypeUuid: "",
      shipyardUuid: "",
      numberOfVessels: "",
      budgetProjectNumber: "",
    },
  });

  const { data: shipyards = [], isLoading: isLoadingShipyards } = useQuery({
    queryKey: ["shipyards"],
    queryFn: getShipyards,
  });

  const { data: staff = [], isLoading: isLoadingStaff } = useQuery({
    queryKey: ["staff"],
    queryFn: getStaff,
  });

  const { data: vesselTypes = [], isLoading: isLoadingVesselTypes } = useQuery({
    queryKey: ["vesselTypes"],
    queryFn: getVesselTypes,
  });

  // Check if all queries are loaded
  const allQueriesLoaded =
    !isLoadingShipyards && !isLoadingStaff && !isLoadingVesselTypes;

  // Set form values when projectData changes AND all queries are loaded
  useEffect(() => {
    if (projectData && allQueriesLoaded) {
      form.reset({
        name: projectData.name || "",
        designer: projectData.designer || "",
        shipOwner: projectData.shipOwner || "",
        staffId: projectData.staffId || "",
        vesselTypeUuid: projectData.vesselTypeUuid || "",
        shipyardUuid: projectData.shipyardUuid || "",
        numberOfVessels: projectData.numberOfVessels || "",
        budgetProjectNumber: projectData.budgetProjectNumber || "",
      });
    }
  }, [projectData, allQueriesLoaded, form]);

  const onSubmit = async (data: ProjectUpdatePayload) => {
    try {
      // Required fields validation
      if (!data.name) {
        toast({
          title: "Error",
          description: "Project name is required",
          variant: "destructive",
        });
        return;
      }

      const response = await api.projects({ uuid: projectData.uuid }).put(data);

      if (response.data) {
        toast({
          title: "Success",
          description: "Project updated successfully",
        });
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        queryClient.invalidateQueries({
          queryKey: ["project", projectData.uuid],
        });

        onSuccess?.();
      } else {
        const errorMessage = response.error
          ? typeof response.error === "object" && "message" in response.error
            ? (response.error as any).message
            : "Unknown error"
          : "Project could not be updated";

        toast({
          title: "Error",
          description: "Project update failed: " + errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast({
        title: "Error",
        description:
          "An error occurred while updating the project. Please try again.",
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
              <FormLabel>Project Name*</FormLabel>
              <FormControl>
                <Input placeholder="Enter project name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shipyardUuid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shipyard*</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a shipyard" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {shipyards.map((shipyard) => (
                    <SelectItem key={shipyard.uuid} value={shipyard.uuid}>
                      {shipyard.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vesselTypeUuid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vessel Type*</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vessel type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {vesselTypes.map((type) => (
                    <SelectItem key={type.uuid} value={type.uuid}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="staffId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Manager*</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a staff member" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {staff.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.firstName} {member.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="designer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Designer</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter designer name"
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
            name="shipOwner"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ship Owner</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter ship owner name"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="numberOfVessels"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Vessels</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter number of vessels"
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
            name="budgetProjectNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget Project Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter budget project number"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Updating..." : "Update Project"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
