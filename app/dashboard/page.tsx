"use client"

import { useState, useMemo, useEffect } from "react";
import { Plus, StickyNote, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/uiComponents/AppHeader";
import { SearchBar } from "@/components/uiComponents/SearchBar";
import { NoteCard, Note } from "@/components/uiComponents/NoteCard";
import { NoteEditor } from "@/components/uiComponents/NoteEditor";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import Logo from "@/components/uiComponents/Logo";
import useAuthStore from "@/store/authStore";
import useNotesHook from "@/hooks/notesHook";
import { toast } from "react-toastify";





export default function Dashboard() {
  // const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | undefined>();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [deleteNote, setDeleteNote] = useState<Note | null>(null);
  const router = useRouter();
  const { user, token, notes } = useAuthStore();
  const { getNotes } = useNotesHook();


  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    const query = searchQuery.toLowerCase();
    return notes.filter(
      (note: any) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags.some((tag: any) => tag.toLowerCase().includes(query))
    );
  }, [notes, searchQuery]);

  const handleCreateNote = () => {
    setSelectedNote(undefined);
    setIsEditorOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setIsEditorOpen(true);
  };

//  const handleSaveNote = async (noteData: Note) => {
//   try {
//     const formData = new FormData();
//      // append files
//     noteData?.file?.forEach((f: any) => {
//       formData.append("file", f);
//     });

//      const uploadres = await fetch(`api/uploadFiles`,
//       {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       }
//     );

//     // append note fields
//     formData.append("title", noteData.title);
//     formData.append("content", noteData.content);
//     formData.append("tags", noteData.content);

   

//     // if update add note id
//     if (selectedNote) {
//       formData.append("notesId", selectedNote.id);
//     }

//     const res = await fetch(
//       selectedNote ? "/api/notes/updatenotes" : "/api/notes/createnotes",
//       {
//         method: selectedNote ? "PATCH" : "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       }
//     );

//     const data = await res.json();

//     if (!res.ok) {
//       throw new Error(data.message);
//     }

//     await getNotes(token as string);
//     toast(data?.message);

//   } catch (err: any) {
//     toast(err?.message);
//   }

//   setIsEditorOpen(false);
//   setSelectedNote(undefined);
// };
const handleSaveNote = async (noteData: any) => {
  try {
    // STEP 1: Upload new files (same as before)
    let uploadedFiles: string[] = [];

    if (noteData.file?.length > 0) {
      const uploadForm = new FormData();

      noteData.file.forEach((f: File) => {
        uploadForm.append("file", f);
      });

      const uploadRes = await fetch("/api/uploadFiles", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadForm,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.message);

      uploadedFiles = uploadData.files;
    }

    // STEP 2: Final file list
    const finalFiles = [
      ...noteData.existingFiles,
      ...uploadedFiles,
    ];

    // STEP 3: Create FormData for notes API
    const formData = new FormData();

    formData.append("title", noteData.title);
    formData.append("content", noteData.content);
    formData.append("summary", noteData.summary || "");

    // ✅ arrays must be stringified
    formData.append("tags", JSON.stringify(noteData.tags || []));
    formData.append("filePaths", JSON.stringify(finalFiles));
    formData.append("removedFiles", JSON.stringify(noteData.removedFiles || []));

    if (selectedNote) {
      formData.append("notesId", selectedNote.id);
    }

    // STEP 4: Call API
    const res = await fetch(
      selectedNote ? "/api/notes/updatenotes" : "/api/notes/createnotes",
      {
        method: selectedNote ? "PATCH" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // DO NOT set Content-Type manually
        },
        body: formData,
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    await getNotes(token as string);
    toast(data?.message);

  } catch (err: any) {
    toast(err?.message);
  }

  setIsEditorOpen(false);
  setSelectedNote(undefined);
};
  const handleDeleteNote = async () => {
    if (deleteNote) {
      try {
        const res = await fetch("/api/notes/deletenotes", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            { notesId: deleteNote.id }
          ),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
        }

        await getNotes(token as string)


        toast(data?.message)
      }
      catch (err: any) {
        toast(err?.message)
      }
      setDeleteNote(null);
    }
  };

  const handleLogout = () => {
    router.replace("/login");
  };

  const handleProfile = () => {
    router.push("/profile");
  };

  useEffect(() => {
    if (token) {
      getNotes(token);
    }
  }, [])

const handleFileRemove= async()=>{
    try {
        const res = await fetch("/api/notes/deleteFile", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            { notesId: selectedNote?.id }
          ),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
        }

        await getNotes(token as string)


        toast(data?.message)
      }
      catch (err: any) {
        toast(err?.message)
      }
}

  return (
    <div className="min-h-screen flex flex-col bg-background items-center justify-center">
      <AppHeader user={user} onLogout={handleLogout} onProfile={handleProfile} />

      <main className="flex-1 container py-6 space-y-6">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">My Notes</h1>
            <p className="text-muted-foreground mt-1">
              {notes.length} note{notes.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <Button
            onClick={handleCreateNote}
            className="gap-2 bg-primary hover:opacity-90 shadow-glow"
          >
            <Plus className="h-4 w-4" />
            New Note
          </Button>
        </div>
        {/* Search */}
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {/* Notes Grid */}
        {filteredNotes.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note: any, index: any) => (
              <div
                key={note.id}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <NoteCard
                  note={note}
                  onClick={() => handleEditNote(note)}
                  onEdit={() => handleEditNote(note)}
                  onDelete={() => setDeleteNote(note)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              {searchQuery ? (
                <FileText className="h-8 w-8 text-muted-foreground" />
              ) : (
                <StickyNote className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">
              {searchQuery ? "No notes found" : "No notes yet"}
            </h3>
            <p className="text-muted-foreground max-w-sm">
              {searchQuery
                ? `No notes match "${searchQuery}". Try a different search term.`
                : "Create your first note to get started. Use AI features to enhance your notes."}
            </p>
            {!searchQuery && (
              <Button
                onClick={handleCreateNote}
                className="mt-4 gap-2 bg-primary hover:opacity-90"
              >
                <Plus className="h-4 w-4" />
                Create Note
              </Button>
            )}
          </div>
        )}
      </main>

      {/* Note Editor Modal */}
      <NoteEditor
        note={selectedNote}
        onSave={handleSaveNote}
        onClose={() => {
          setIsEditorOpen(false);
          setSelectedNote(undefined);
        }}
        isOpen={isEditorOpen}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteNote} onOpenChange={() => setDeleteNote(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete note?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deleteNote?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteNote}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
