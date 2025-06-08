import { Button } from "#components/ui/button.js";
import { Card, CardContent } from "#components/ui/card";
import { Textarea } from "#components/ui/textarea.js";
import { toast } from "#hooks/use-toast.js";
import { api } from "#lib/api.js";
import { authClient } from "#lib/auth.js";
import { typeboxResolver } from "#lib/resolver.js";
import { conversationMessageCreateDto, ConversationMessageCreatePayload } from "@onlyjs/api";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { IconPaperclip, IconPhoto, IconX } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface MessageSenderProps {
  conversationId: string;
}

export function MessageSender({ conversationId }: MessageSenderProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  // Track attachment preview state separately
  const [attachmentPreview, setAttachmentPreview] = useState<{
    id: string;
    name: string;
    url: string;
    size: number;
    type: string;
    isImage: boolean;
  } | undefined>();

  // Get current user session to determine sender type
  const { data: session } = authClient.useSession();

  // React Hook Form setup - using backend DTO
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid }
  } = useForm<ConversationMessageCreatePayload>({
    resolver: typeboxResolver(conversationMessageCreateDto.body),
    defaultValues: {
      text: "",
      sender: session?.user ? "SHIPYARD" : "SUPPLIER",
      attachmentFile: undefined,
      attachmentType: undefined,
    },
    mode: "onChange",
  });

  // Watch form values
  const watchedText = watch("text");

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (payload: ConversationMessageCreatePayload) => {
      const response = await api.conversation({uuid: conversationId})["send-message"].put(payload);
      
      if (!response.data) {
        throw new Error("Failed to send message");
      }
      
      return response.data;
    },
    onSuccess: () => {
      // Clean up attachment preview URL
      if (attachmentPreview?.url?.startsWith('blob:')) {
        URL.revokeObjectURL(attachmentPreview.url);
      }

      // Reset form and preview state
      reset();
      setAttachmentPreview(undefined);
      
      // Refresh conversation
      queryClient.invalidateQueries({ queryKey: ["conversation", conversationId] });
      
      toast({
        title: "Success",
        description: "Message sent successfully",
      });
    },
    onError: (error) => {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ConversationMessageCreatePayload) => {
    // Validate that we have either text or attachment
    if (!data.text.trim() && !data.attachmentFile) {
      toast({
        title: "Error",
        description: "Please enter a message or attach a file",
        variant: "destructive",
      });
      return;
    }

    sendMessageMutation.mutate(data);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, isImage: boolean = false) => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    // Check file size limit
    const maxSize = isImage ? 5 * 1024 * 1024 : 10 * 1024 * 1024; // 5MB for images, 10MB for files
    
    if (file.size > maxSize) {
      toast({
        title: "File Size Error",
        description: `File is too large. Maximum size is ${isImage ? '5MB' : '10MB'}.`,
        variant: "destructive",
      });
      return;
    }

    // Clean up previous preview URL
    if (attachmentPreview?.url?.startsWith('blob:')) {
      URL.revokeObjectURL(attachmentPreview.url);
    }

    // Set form values
    setValue("attachmentFile", file);
    setValue("attachmentType", isImage ? "CONVERSATION_IMAGE" : "CONVERSATION_FILE");

    // Create preview data
    const preview = {
      id: crypto.randomUUID(),
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
      type: file.type || 'application/octet-stream',
      isImage,
    };

    setAttachmentPreview(preview);

    // Reset input
    if (isImage && imageInputRef.current) {
      imageInputRef.current.value = "";
    } else if (!isImage && fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    toast({
      title: "File Added",
      description: `${isImage ? 'Image' : 'File'} added successfully`,
    });
  };

  const removeAttachment = () => {
    // Clean up preview URL
    if (attachmentPreview?.url?.startsWith('blob:')) {
      URL.revokeObjectURL(attachmentPreview.url);
    }

    // Reset form values
    setValue("attachmentFile", undefined);
    setValue("attachmentType", undefined);
    setAttachmentPreview(undefined);
  };

  const hasAttachment = !!attachmentPreview;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="border-2 border-border/50 bg-card/95 shadow-lg backdrop-blur-sm">
        <CardContent className="p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Main Input Area */}
            <div className="space-y-3">
              <Controller
                name="text"
                control={control}
                rules={{ 
                  validate: (value) => {
                    const hasContent = value && value.trim().length > 0;
                    const hasAttachment = !!attachmentPreview;
                    
                    if (!hasContent && !hasAttachment) {
                      return "Please enter a message or attach a file";
                    }
                    return true;
                  }
                }}
                render={({ field }) => (
                  <div className="relative">
                    <Textarea
                      {...field}
                      placeholder="Type your message here..."
                      className="min-h-[100px] w-full resize-none border-2 border-border/50 bg-background/50 text-sm shadow-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                      disabled={sendMessageMutation.isPending}
                    />
                    {errors.text && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-red-500">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {errors.text.message}
                      </div>
                    )}
                  </div>
                )}
              />

              {/* Single Attachment Preview */}
              {attachmentPreview && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {attachmentPreview.isImage ? (
                      <IconPhoto className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <IconPaperclip className="h-4 w-4 text-muted-foreground" />
                    )}
                    <p className="text-sm font-medium text-muted-foreground">
                      {attachmentPreview.isImage ? 'Image' : 'File'} Attachment
                    </p>
                  </div>
                  
                  {attachmentPreview.isImage ? (
                    // Image Preview
                    <div className="relative group max-w-xs">
                      <div className="aspect-square overflow-hidden rounded-lg border border-border/50 bg-muted/20">
                        <img
                          src={attachmentPreview.url}
                          alt={attachmentPreview.name}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="mt-1">
                        <p className="text-xs text-muted-foreground truncate">{attachmentPreview.name}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-background/90 p-0 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                        onClick={removeAttachment}
                      >
                        <IconX className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    // File Preview
                    <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 p-3 transition-colors hover:bg-muted/50">
                      <div className="flex-shrink-0">
                        {/* File Type Icon */}
                        {(() => {
                          const type = attachmentPreview.type.toLowerCase();
                          
                          if (type.includes('pdf')) {
                            return (
                              <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                              </svg>
                            );
                          }
                          
                          if (type.includes('word') || type.includes('doc')) {
                            return (
                              <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                              </svg>
                            );
                          }
                          
                          if (type.includes('excel') || type.includes('sheet')) {
                            return (
                              <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                              </svg>
                            );
                          }
                          
                          return <IconPaperclip className="h-4 w-4 text-muted-foreground" />;
                        })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{attachmentPreview.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {attachmentPreview.type} • {(() => {
                            const bytes = attachmentPreview.size;
                            if (bytes === 0) return '0 B';
                            const k = 1024;
                            const sizes = ['B', 'KB', 'MB', 'GB'];
                            const i = Math.floor(Math.log(bytes) / Math.log(k));
                            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
                          })()}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 rounded-full p-0 hover:bg-destructive/10 hover:text-destructive"
                        onClick={removeAttachment}
                      >
                        <IconX className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between border-t border-border/50 pt-4">
              <div className="flex gap-2">
                {/* Hidden file inputs */}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e, false)}
                />
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e, true)}
                />

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2 hover:bg-muted/50"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={sendMessageMutation.isPending || hasAttachment}
                >
                  <IconPaperclip className="h-4 w-4" />
                  <span className="hidden sm:inline">Add File</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2 hover:bg-muted/50"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={sendMessageMutation.isPending || hasAttachment}
                >
                  <IconPhoto className="h-4 w-4" />
                  <span className="hidden sm:inline">Add Image</span>
                </Button>
              </div>

              <div className="flex items-center gap-2">
                {hasAttachment && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
                    onClick={removeAttachment}
                    disabled={sendMessageMutation.isPending}
                  >
                    Remove
                  </Button>
                )}
                
                <Button
                  type="submit"
                  size="sm"
                  className="gap-2 min-w-[100px]"
                  disabled={!isValid || (!watchedText?.trim() && !hasAttachment) || sendMessageMutation.isPending}
                >
                  {sendMessageMutation.isPending ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <PaperPlaneIcon className="h-4 w-4" />
                      Send
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 