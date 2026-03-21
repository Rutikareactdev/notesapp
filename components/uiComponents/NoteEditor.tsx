import { useState, useEffect, useRef } from "react";
import { X, Save, Loader2, Upload, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AIButton } from "@/components/uiComponents/AIButton";
import { Note } from "@/components/uiComponents/NoteCard";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import useAuthStore from "@/store/authStore";

interface NoteEditorProps {
  note?: Note;
  onSave: (note: any) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function NoteEditor({ note, onSave, onClose, isOpen }: NoteEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [summary, setSummary] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [file, setFile] = useState<File[]>([]);
  const [aiLoading, setAiLoading] = useState<"summary" | "improve" | "tags" | null>(null);
  const { token } = useAuthStore();
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [existingFiles, setExistingFiles] = useState<any[]>([]);
   const [removedFiles, setRemovedFiles] = useState<any[]>([]);



  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags);
      setSummary(note.summary || "");
      setExistingFiles(note?.filePaths|| []);
    } else {
      setTitle("");
      setContent("");
      setTags([]);
      setSummary("");
      setExistingFiles([]);
    }
  }, [note]);

  const handleSave = async () => {
    if (!title.trim()) return;
    setIsSaving(true);
    // Simulate save delay
    await new Promise((r) => setTimeout(r, 500));
    onSave({ title, content, tags, summary, file , existingFiles,removedFiles});
    setIsSaving(false);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAISummary = async () => {
    setAiLoading("summary");
    try {
      const res = await fetch("/api/ai/generateSummary", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw Error(data?.message)
      }
      setSummary(data?.summary);
    }
    catch (err: any) {
      console.log(err)
      toast(err?.message || "failed to generate summary")
    }
    setAiLoading(null);
  };

  const handleAIImprove = async () => {
    setAiLoading("improve");
    try {
      const res = await fetch("/api/ai/improveGrammer", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw Error(data?.message)
      }
      setContent(data?.correctGrammar);

    } catch (err: any) {
      console.log(err)
      toast(err?.message || "failed to improve content")
    }

    setAiLoading(null);
  };

  const handleAITags = async () => {
    setAiLoading("tags");
    try {
      const res = await fetch("/api/ai/generateTags", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw Error(data?.message)
      }
      const newTags = data?.tags;
      setTags([...new Set([...tags, ...newTags])]);
    }
    catch (err: any) {
      console.log(err)
      toast(err?.message || "failed to add tags")
    }
    setAiLoading(null);
  };

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "application/msword", // .doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "application/vnd.ms-excel", // .xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-powerpoint", // .ppt
      "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
    ];

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB in bytes

    const selectedFiles = Array.from(e.target.files).filter(file => {
      if (!allowedTypes.includes(file.type)) {
        alert(`${file.name} is not an allowed type.`);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        alert(`${file.name} exceeds 5 MB.`);
        return false;
      }
      return true;
    });

    setFile((prevFile) => [...prevFile, ...selectedFiles]);
  };

  const handleclose = () => {
    onClose()
    setTitle('');
    setSummary('')
    setFile([]);
    setTags([])
    setContent('')
  }
const handleFileRemove = (file: string) => {
  // remove from UI
  setExistingFiles((prev) => prev.filter((f) => f !== file));

  // track removed
  setRemovedFiles((prev) => [...prev, file]);
};

 

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className={cn(
        "w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-xl border bg-card shadow-lg animate-scale-in",
        "flex flex-col"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-display text-xl font-semibold">
            {note ? "Edit Note" : "New Note"}
          </h2>
          <Button variant="ghost" size="icon" onClick={handleclose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-semibold h-12 border-0 border-b rounded-none px-0 focus-visible:ring-0"
            />
          </div>

          <Textarea
            placeholder="Start writing your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px] resize-none border-0 focus-visible:ring-0 text-base leading-relaxed"
          />


          <div className="" onClick={handleClick}>
            <Upload />
          </div>

          <Input
            ref={inputRef}
            type="file"
            multiple
            onChange={handleFile}
            className="hidden text-lg font-semibold h-12 border-0 border-b rounded-none px-0 focus-visible:ring-0"

          />

          {/* Existing Files */}
          {existingFiles.length > 0 && (
            <ul className="mt-2 text-sm text-gray-700">
              {existingFiles.map((file, index) => (
                <li key={`existing-${index}`} className="flex items-center justify-between">
                  <a
                    href={file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {file || `File ${index + 1}`}
                  </a>

                  <button
                    onClick={() =>
                      handleFileRemove(file)
                    }
                    className="ml-2 text-red-500"
                  >
                   <Trash size={15}/>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* New Files */}
          {file.length > 0 && (
            <ul className="mt-2 text-sm text-gray-700">
              {file.map((file, index) => (
                <li key={`new-${index}`} className="flex items-center justify-between">
                  <span>{file.name}</span>

                  <button
                    onClick={() =>
                      setFile((prev) => prev.filter((_, i) => i !== index))
                    }
                    className="ml-2 text-red-500"
                  >
                  <Trash size={15}/>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* AI Features */}
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            <span className="text-xs text-muted-foreground self-center mr-2">AI Tools:</span>
            <AIButton
              feature="summary"
              onClick={handleAISummary}
              isLoading={aiLoading === "summary"}
              disabled={!!aiLoading}
              size="sm"
            />
            <AIButton
              feature="improve"
              onClick={handleAIImprove}
              isLoading={aiLoading === "improve"}
              disabled={!!aiLoading}
              size="sm"
            />
            <AIButton
              feature="tags"
              onClick={handleAITags}
              isLoading={aiLoading === "tags"}
              disabled={!!aiLoading}
              size="sm"
            />
          </div>

          {/* Summary Preview */}
          {summary && (
            <div className="p-3 rounded-lg bg-ai-summary/5 border border-ai-summary/20">
              <p className="text-xs text-muted-foreground mb-1 font-medium">AI Summary</p>
              <p className="text-sm text-foreground">{summary}</p>
            </div>
          )}

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Tags</label>
            <div className="flex flex-wrap gap-2 items-center">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="gap-1 pr-1"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:bg-foreground/10 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <Input
                placeholder="Add tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="w-24 h-7 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t bg-muted/30">
          <Button variant="outline" onClick={handleclose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!title.trim() || isSaving}
            className="gap-2 bg-primary hover:opacity-90"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Note
          </Button>
        </div>
      </div>
    </div>
  );
}
