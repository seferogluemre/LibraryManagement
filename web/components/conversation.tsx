import { Card } from "#components/ui/card";
import { api } from "#lib/api.js";
import { ConversationShowResponse } from "@onlyjs/api";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { MessageItem } from "./message-item.js";
import { MessageSender } from "./message-sender.js";

interface ConversationProps {
  conversationId: string;
}

// Types from backend - exact structure
type BackendMessage = {
  text: string;
  sender: "SHIPYARD" | "SUPPLIER";
  createdAt: string;
  attachment?: {
    name: string;
    path: string;
    size: string;
    type: "CONVERSATION_IMAGE" | "CONVERSATION_FILE";
    uuid: string;
    mimeType: string;
  };
};

type ProcessedMessage = BackendMessage & {
  id: string; // Frontend generated ID for React keys
  author: {   // Frontend generated author info
    id: string;
    name: string;
    role: "supplier" | "shipyard";
  };
};

export function Conversation({ conversationId }: ConversationProps) {
  const { data: conversation, isLoading, error } = useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () => getConversation(conversationId),
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <Card className="flex h-full w-full items-center justify-center rounded-none border-0 shadow-none">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading conversation...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex h-full w-full items-center justify-center rounded-none border-0 shadow-none">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600">Failed to load conversation</p>
          <p className="text-sm text-red-500/70">Please try refreshing the page</p>
        </div>
      </Card>
    );
  }

  if (!conversation) {
    return (
      <Card className="flex h-full w-full items-center justify-center rounded-none border-0 shadow-none">
        <div className="text-center">
          <p className="text-muted-foreground">Conversation not found</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex h-full w-full flex-col overflow-hidden rounded-none border-0 shadow-none">
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Conversation Header */}
        <div className="border-b bg-background/95 px-4 py-3 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                {conversation.rfq?.name || "RFQ Communication"}
              </h2>
              {conversation.createdAt && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Created on{" "}
                  {format(new Date(conversation.createdAt), "dd MMMM yyyy")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div
          className="flex-1 overflow-y-auto px-4 py-4"
          style={{ minHeight: "calc(100vh - 20rem)" }}
        >
          <ConversationMessages messages={conversation.messages || []} />
        </div>

        {/* Message Sender - Fixed at bottom */}
        <div className="border-t bg-background/95 p-4 backdrop-blur-sm">
          <MessageSender conversationId={conversationId} />
        </div>
      </div>
    </Card>
  );
}

function ConversationMessages({ messages }: { messages: BackendMessage[] }) {
  if (!messages) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <svg className="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.681L3 21l2.681-5.094A8.959 8.959 0 773 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
            </svg>
          </div>
          <p className="text-muted-foreground">No messages yet</p>
          <p className="text-sm text-muted-foreground/70">Start the conversation by sending a message below</p>
        </div>
      </div>
    );
  }

  if (!Array.isArray(messages)) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600">Invalid messages format</p>
          <p className="text-sm text-red-500/70">Please refresh the page</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <svg className="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.681L3 21l2.681-5.094A8.959 8.959 0 773 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
            </svg>
          </div>
          <p className="text-muted-foreground">No messages yet</p>
          <p className="text-sm text-muted-foreground/70">Start the conversation by sending a message below</p>
        </div>
      </div>
    );
  }

  // Process messages - much simpler now
  const processedMessages: ProcessedMessage[] = messages.map((message, index) => {
    return {
      ...message, // Spread all backend fields (text, sender, createdAt, attachment)
      id: `message-${index}`, // Add frontend ID
      author: createAuthorFromMessage(message), // Add frontend author
    };
  });

  return (
    <div className="space-y-4">
      {processedMessages.map((message) => (
        <div key={message.id} className="w-full">
          <MessageItem message={message} />
        </div>
      ))}
    </div>
  );
}

// Helper function to create author from message data
function createAuthorFromMessage(message: BackendMessage) {
  const sender = message.sender;
  
  return {
    id: crypto.randomUUID(),
    name: sender === "SHIPYARD" ? "Shipyard Team" : "Supplier",
    role: sender === "SHIPYARD" ? ("shipyard" as const) : ("supplier" as const),
  };
}

async function getConversation(conversationId: string): Promise<ConversationShowResponse & { messages: BackendMessage[] }> {
  try {
    const response = await api.conversation({ uuid: conversationId }).get({});
    
    if (response.data) {
      return response.data as ConversationShowResponse & { messages: BackendMessage[] };
    }
    
    throw new Error("Failed to get Conversation");
  } catch (error) {
    console.error("API Call failed:", error);
    throw error;
  }
}
