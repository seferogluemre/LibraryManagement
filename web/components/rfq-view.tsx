import { Conversation } from "#components/conversation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#components/ui/card";
import { api } from "#lib/api.js";
import { useQuery } from "@tanstack/react-query";

interface RFQViewProps {
  rfqId: string;
}

export function RFQView({ rfqId }: RFQViewProps) {
  // Query for RFQ data
  const {
    data: rfq,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["rfq", rfqId],
    queryFn: async () => {
      const response = await api.rfq({ uuid: rfqId }).get({});
      if (response.data) {
        return response.data;
      }
      throw new Error("RFQ not found");
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl">
        <div className="flex h-64 items-center justify-center">
          <p className="text-muted-foreground">Loading RFQ...</p>
        </div>
      </div>
    );
  }

  if (error || !rfq) {
    return (
      <div className="container mx-auto max-w-6xl">
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <p className="font-medium text-red-600">Error loading RFQ</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {error?.message || "Unknown error"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{rfq.name}</h1>
        <p className="text-muted-foreground">
          Project: {rfq.project?.name} | Supplier: {rfq.supplier?.name}
        </p>
      </div>

      {/* RFQ Details */}
      <Card>
        <CardHeader>
          <CardTitle>RFQ Details</CardTitle>
          <CardDescription>Request for quotation information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Project
              </label>
              <p className="font-medium">{rfq.project?.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Category
              </label>
              <p className="font-medium">{rfq.projectCategory?.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Shipyard
              </label>
              <p className="font-medium">{rfq.shipyard?.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Supplier
              </label>
              <p className="font-medium">{rfq.supplier?.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Created Date
              </label>
              <p className="font-medium">
                {new Date(rfq.createdAt).toLocaleDateString("en-US")}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Updated Date
              </label>
              <p className="font-medium">
                {new Date(rfq.updatedAt).toLocaleDateString("en-US")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversation */}
      {rfq.conversation && (
        <Card>
          <CardHeader>
            <CardTitle>Conversation</CardTitle>
            <CardDescription>RFQ related conversation history</CardDescription>
          </CardHeader>
          <CardContent>
            <Conversation conversationId={rfq.conversation.uuid} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
