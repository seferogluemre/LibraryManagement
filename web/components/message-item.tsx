import { asset } from "#lib/asset.js";
import { authClient } from "#lib/auth.js";
import { IconPaperclip } from "@tabler/icons-react";

// Simplified Message type matching backend structure
type Message = {
  id: string;
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
  author: {
    id: string;
    name: string;
    role: "supplier" | "shipyard";
  };
};

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  // Get current user session to determine if this is "my" message
  const { data: session } = authClient.useSession();
  
  // Determine if this message is from the current user
  const isMyMessage = session?.user 
    ? message.sender === "SHIPYARD" // If logged in, my messages are SHIPYARD
    : message.sender === "SUPPLIER"; // If not logged in, my messages are SUPPLIER

  const getRoleStyles = (sender: "SHIPYARD" | "SUPPLIER", isMyMessage: boolean) => {
    if (isMyMessage) {
      // My messages - always on the right
      return {
        container: "flex justify-end",
        messageBox: "max-w-[70%] bg-primary/10 border border-primary/20",
        stripe: "bg-primary",
        badge: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary",
        label: session?.user ? "You (Shipyard)" : "You (Supplier)",
        alignment: "right" as const,
      };
    } else {
      // Other's messages - always on the left
      return {
        container: "flex justify-start",
        messageBox: "max-w-[70%] bg-muted/50 border border-border/50",
        stripe: sender === "SHIPYARD" ? "bg-blue-500" : "bg-green-500",
        badge: sender === "SHIPYARD" 
          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
          : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
        label: sender === "SHIPYARD" ? "Shipyard" : "Supplier",
        alignment: "left" as const,
      };
    }
  };

  // Defensive programming: handle undefined author or sender
  const messageSender = message.sender || "SUPPLIER";
  const authorName = message.author?.name || "Unknown User";
  const roleStyles = getRoleStyles(messageSender, isMyMessage);

  return (
    <div className={`w-full ${roleStyles.container}`}>
      <div className={`${roleStyles.messageBox} rounded-2xl shadow-sm overflow-hidden`}>
        {/* Top stripe */}
        <div className={`h-1 w-full ${roleStyles.stripe}`}></div>

        <div className="p-4">
          {/* Header */}
          <div className={`flex items-center gap-2 mb-2 ${
            roleStyles.alignment === 'right' ? 'justify-end' : 'justify-start'
          }`}>
            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${roleStyles.badge}`}>
              {roleStyles.label}
            </span>
            <span className="text-xs text-muted-foreground">
              {message.createdAt ? new Date(message.createdAt).toLocaleString("tr-TR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }) : "Unknown time"}
            </span>
          </div>

          {/* Author name - only show if not my message */}
          {!isMyMessage && (
            <p className={`text-sm font-medium mb-2 ${
              roleStyles.alignment === 'right' ? 'text-right' : 'text-left'
            }`}>
              {authorName}
            </p>
          )}

          {/* Message content */}
          <div className="space-y-3">
            {/* Only show text content if it exists and is not empty */}
            {message.text && message.text.trim() && (
              <p className="whitespace-pre-line text-sm leading-relaxed">{message.text}</p>
            )}

            {/* Show attachment-only message indicator if no text but has attachments */}
            {(!message.text || !message.text.trim()) && 
             (message.attachment && (
              <div className={`flex items-center gap-2 text-sm text-muted-foreground ${
                roleStyles.alignment === 'right' ? 'justify-end' : 'justify-start'
              }`}>
                <IconPaperclip className="h-4 w-4" />
                <span className="italic">
                  {message.attachment.name}
                </span>
              </div>
            ))}

            {/* Image Preview */}
            {message.attachment && message.attachment.type === "CONVERSATION_IMAGE" && (
              <MessageImages attachment={message.attachment} />
            )}

            {/* File List */}
            {message.attachment && message.attachment.type === "CONVERSATION_FILE" && (
              <MessageFiles attachment={message.attachment} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageImages({ attachment }: { attachment: Message['attachment'] }) {
  if (!attachment) return null;
  
  return (
    <div className="max-w-sm">
      <a
        href={asset(attachment.path)}
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
      >
        <div className="relative overflow-hidden rounded-lg border-2 border-border/30 bg-muted/20 transition-all duration-200 hover:border-primary hover:shadow-lg">
          <img
            src={asset(attachment.path)}
            alt={attachment.name}
            className="h-auto max-h-48 w-full object-cover transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/10" />
          
          {/* Image overlay with name */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <p className="text-xs text-white font-medium truncate">{attachment.name}</p>
          </div>
        </div>
      </a>
    </div>
  );
}

function MessageFiles({ attachment }: { attachment: Message['attachment'] }) {
  if (!attachment) return null;

  // Helper function to get file type icon and color
  const getFileIconAndColor = (mimeType: string) => {
    const type = mimeType.toLowerCase();
    
    if (type.includes('pdf')) {
      return {
        icon: (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
        ),
        color: "text-red-500",
        bgColor: "bg-red-50 border-red-200 hover:bg-red-100",
        darkBgColor: "dark:bg-red-950 dark:border-red-800 dark:hover:bg-red-900"
      };
    }
    
    if (type.includes('word') || type.includes('doc')) {
      return {
        icon: (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
        ),
        color: "text-blue-600",
        bgColor: "bg-blue-50 border-blue-200 hover:bg-blue-100",
        darkBgColor: "dark:bg-blue-950 dark:border-blue-800 dark:hover:bg-blue-900"
      };
    }
    
    if (type.includes('excel') || type.includes('sheet')) {
      return {
        icon: (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
        ),
        color: "text-green-600",
        bgColor: "bg-green-50 border-green-200 hover:bg-green-100",
        darkBgColor: "dark:bg-green-950 dark:border-green-800 dark:hover:bg-green-900"
      };
    }
    
    return {
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
        </svg>
      ),
      color: "text-gray-600",
      bgColor: "bg-gray-50 border-gray-200 hover:bg-gray-100",
      darkBgColor: "dark:bg-gray-950 dark:border-gray-800 dark:hover:bg-gray-900"
    };
  };

  // Helper function to format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const { icon, color, bgColor, darkBgColor } = getFileIconAndColor(attachment.mimeType);
  const fileSize = parseInt(attachment.size || '0');

  return (
    <a
      href={asset(attachment.path)}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-center gap-3 rounded-lg border p-3 transition-all duration-200 hover:shadow-md ${bgColor} ${darkBgColor}`}
    >
      <div className={`flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-primary transition-colors">
          {attachment.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {attachment.mimeType} • {formatFileSize(fileSize)}
        </p>
      </div>
      <div className="flex-shrink-0">
        <svg className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </div>
    </a>
  );
} 