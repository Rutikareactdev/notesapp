import { formatDistanceToNow } from "date-fns";
import { MoreVertical, Trash2, Edit, Sparkles, Paperclip } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  summary?: string;
  filePaths: string[];
}

interface NoteCardProps {
  note: Note;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isSelected?: boolean;
}

export function NoteCard({ note, onClick, onEdit, onDelete, isSelected }: NoteCardProps) {
  const truncatedContent = note.content.length > 150
    ? note.content.substring(0, 150) + "..."
    : note.content;

  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 animate-slide-up",
        "bg-gradient-card border-border/50",
        isSelected && "ring-2 ring-primary shadow-glow"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg font-semibold text-foreground truncate pr-2">
            {note.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(note.updatedAt, { addSuffix: true })}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {truncatedContent}
        </p>


        {note.summary && (
          <>
            <div className="flex items-start gap-x-2">
              <Sparkles className="h-3.5 w-3.5 text-ai-summary mt-1 flex-shrink-0" />
              <p className="text-xs text-muted-foreground ">AI summary</p>
            </div>
            <div className="flex items-start gap-2 p-2 rounded-md bg-ai-summary/5 border border-ai-summary/20">
              <p className="text-xs text-muted-foreground italic line-clamp-2">
                {note.summary}
              </p>
            </div>
          </>
        )}

        {note.filePaths && note.filePaths.length > 0 && (
          <>
            <div className="flex items-start gap-x-2">
              <Sparkles className="h-3.5 w-3.5 text-ai-summary mt-1 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">Attachments</p>
            </div>

            {note?.filePaths.map((file, index) => (
              <Link
                key={index}
                href={`${process.env.AWS_URL}/${file}`}
                className="flex items-center gap-2 p-2 rounded-md bg-ai-summary/5 border border-ai-summary/20"
              >
                <Paperclip className="h-4 w-4 text-ai-summary flex-shrink-0" />

                <p className="text-xs text-muted-foreground italic line-clamp-2">
                  {file}
                </p>
              </Link>
            ))}
          </>
        )}

        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {note.tags.slice(0, 4).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs font-normal px-2 py-0.5"
              >
                {tag}
              </Badge>
            ))}
            {note.tags.length > 4 && (
              <Badge variant="outline" className="text-xs font-normal px-2 py-0.5">
                +{note.tags.length - 4}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
