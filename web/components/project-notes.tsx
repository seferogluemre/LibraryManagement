import { Button } from "#components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "#components/ui/dialog";
import { Textarea } from "#components/ui/textarea";
import { toast } from "#hooks/use-toast";
import { api } from "#lib/api";
import { typeboxResolver } from "#lib/resolver.js";
import { useConfirmationDialog } from "#store/use-confirmation-dialog";
import {
  noteCreateDto,
  NoteCreatePayload,
  noteUpdateDto,
  NoteUpdatePayload,
  ProjectShowResponse,
} from "@onlyjs/api";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";

type ProjectNote = ProjectShowResponse["notes"][number];

interface ProjectNotesProps {
  projectId: string;
  notes: ProjectNote[];
}

export function ProjectNotes({ projectId, notes }: ProjectNotesProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<ProjectNote | null>(null);
  const queryClient = useQueryClient();
  const { show: showConfirmation } = useConfirmationDialog();

  // Create note form
  const createForm = useForm<NoteCreatePayload>({
    resolver: typeboxResolver(noteCreateDto.body),
    defaultValues: {
      content: "",
    },
  });

  // Edit note form
  const editForm = useForm<NoteUpdatePayload>({
    resolver: typeboxResolver(noteUpdateDto.body),
    defaultValues: {
      content: "",
    },
  });

  // Create note mutation
  const createNoteMutation = useMutation({
    mutationFn: async (data: NoteCreatePayload) => {
      const response = await api.projects({ uuid: projectId }).notes.post({
        content: data.content,
      });
      if (response.data) {
        return response.data;
      }
      throw new Error("Failed to create note");
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Note created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      setIsCreateDialogOpen(false);
      createForm.reset();
    },
    onError: (error) => {
      console.error("Error creating note:", error);
      toast({
        title: "Error",
        description: "Failed to create note. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update note mutation
  const updateNoteMutation = useMutation({
    mutationFn: async ({
      noteIndex,
      data,
    }: {
      noteIndex: string;
      data: NoteUpdatePayload;
    }) => {
      const response = await api
        .projects({ uuid: projectId })
        .notes({ noteIndex })
        .put({
          content: data.content,
        });
      if (response.data) {
        return response.data;
      }
      throw new Error("Failed to update note");
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Note updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      setEditingNote(null);
      editForm.reset();
    },
    onError: (error) => {
      console.error("Error updating note:", error);
      toast({
        title: "Error",
        description: "Failed to update note. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: async (noteIndex: string) => {
      const response = await api
        .projects({ uuid: projectId })
        .notes({ noteIndex })
        .delete();
      if (response.data) {
        return response.data;
      }
      throw new Error("Failed to delete note");
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Note deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
    onError: (error) => {
      console.error("Error deleting note:", error);
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateNote = (data: NoteCreatePayload) => {
    if (!data.content.trim()) {
      toast({
        title: "Error",
        description: "Note content cannot be empty",
        variant: "destructive",
      });
      return;
    }
    createNoteMutation.mutate(data);
  };

  const handleEditNote = (note: ProjectNote) => {
    setEditingNote(note);
    editForm.setValue("content", note.content);
  };

  const handleUpdateNote = (data: NoteUpdatePayload) => {
    if (!editingNote) return;

    if (!data.content.trim()) {
      toast({
        title: "Error",
        description: "Note content cannot be empty",
        variant: "destructive",
      });
      return;
    }

    updateNoteMutation.mutate({
      noteIndex: editingNote.index,
      data,
    });
  };

  const handleDeleteNote = (note: ProjectNote) => {
    showConfirmation({
      title: "Delete Note",
      description:
        "Are you sure you want to delete this note? This action cannot be undone.",
      approveText: "Delete",
      rejectText: "Cancel",
      onApprove: () => {
        deleteNoteMutation.mutate(note.index);
      },
    });
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy, HH:mm");
    } catch {
      return "Invalid date";
    }
  };

  return (
    <>
      <Card className="mb-6 max-h-[380px] overflow-y-auto rounded-xl border bg-card shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">Notes</CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsCreateDialogOpen(true)}
              className="gap-2"
            >
              <IconPlus className="h-4 w-4" />
              Add Note
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {notes && notes.length > 0 ? (
            <div className="space-y-3">
              {notes.map((note) => (
                <div
                  key={note.index}
                  className="rounded-r-lg border-l-2 border-blue-300 bg-muted/30 p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="whitespace-pre-wrap break-words text-sm">
                        {note.content}
                      </p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Created: {formatDate(note.createdAt)}</span>
                        {note.updatedAt !== note.createdAt && (
                          <span>Updated: {formatDate(note.updatedAt)}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => handleEditNote(note)}
                        disabled={updateNoteMutation.isPending}
                      >
                        <IconEdit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteNote(note)}
                        disabled={deleteNoteMutation.isPending}
                      >
                        <IconTrash className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <IconPlus className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                No notes available for this project yet.
              </p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                Click "Add Note" to create your first note.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Note Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IconPlus className="h-5 w-5" />
              Add New Note
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={createForm.handleSubmit(handleCreateNote)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label
                htmlFor="create-note-content"
                className="text-sm font-medium"
              >
                Note Content
              </label>
              <Textarea
                id="create-note-content"
                placeholder="Write your note here..."
                className="min-h-[120px] resize-none"
                {...createForm.register("content", {
                  required: "Note content is required",
                  validate: (value) =>
                    value.trim().length > 0 || "Note content cannot be empty",
                })}
                disabled={createNoteMutation.isPending}
              />
              {createForm.formState.errors.content && (
                <p className="text-xs text-destructive">
                  {createForm.formState.errors.content.message}
                </p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  createForm.reset();
                }}
                disabled={createNoteMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createNoteMutation.isPending}
                className="gap-2"
              >
                {createNoteMutation.isPending ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Creating...
                  </>
                ) : (
                  <>
                    <IconPlus className="h-4 w-4" />
                    Create Note
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Note Dialog */}
      <Dialog
        open={!!editingNote}
        onOpenChange={(open) => !open && setEditingNote(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IconEdit className="h-5 w-5" />
              Edit Note
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={editForm.handleSubmit(handleUpdateNote)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label
                htmlFor="edit-note-content"
                className="text-sm font-medium"
              >
                Note Content
              </label>
              <Textarea
                id="edit-note-content"
                placeholder="Write your note here..."
                className="min-h-[120px] resize-none"
                {...editForm.register("content", {
                  required: "Note content is required",
                  validate: (value) =>
                    value.trim().length > 0 || "Note content cannot be empty",
                })}
                disabled={updateNoteMutation.isPending}
              />
              {editForm.formState.errors.content && (
                <p className="text-xs text-destructive">
                  {editForm.formState.errors.content.message}
                </p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingNote(null);
                  editForm.reset();
                }}
                disabled={updateNoteMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateNoteMutation.isPending}
                className="gap-2"
              >
                {updateNoteMutation.isPending ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Updating...
                  </>
                ) : (
                  <>
                    <IconEdit className="h-4 w-4" />
                    Update Note
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
