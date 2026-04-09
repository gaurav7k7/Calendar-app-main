import { useState } from "react";
import {type CalendarNote,type DateRange, getRangeLabel } from "@/lib/calendar-utils";
import { Trash2, Plus, StickyNote } from "lucide-react";

interface NotesPanelProps {
  notes: CalendarNote[];
  range: DateRange;
  onAddNote: (text: string) => void;
  onDeleteNote: (id: string) => void;
}

export function NotesPanel({ notes, range, onAddNote, onDeleteNote }: NotesPanelProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !range.start) return;
    onAddNote(text.trim());
    setText("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <StickyNote className="w-4 h-4 text-primary" />
        <h3 className="font-display text-base font-semibold text-foreground">Notes</h3>
      </div>

      <p className="text-xs text-muted-foreground font-body mb-4">
        {getRangeLabel(range)}
      </p>

      {/* Add note form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={range.start ? "Add a note for this range..." : "Select dates first..."}
          disabled={!range.start}
          className="w-full border border-border rounded-md px-3 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none h-20 disabled:opacity-40"
        />
        <button
          type="submit"
          disabled={!text.trim() || !range.start}
          className="mt-2 flex items-center gap-1 text-xs font-body font-medium text-primary-foreground bg-primary px-3 py-1.5 rounded-md hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="w-3 h-3" />
          Add Note
        </button>
      </form>

      {/* Notes list */}
      <div className="flex-1 space-y-2 min-h-0 overflow-y-scroll max-h-full">
        {notes.length === 0 && (
          <p className="text-xs text-muted-foreground/60 font-body italic">No notes yet</p>
        )}
        {notes.map((note) => (
          <div key={note.id} className="bg-primary/10 rounded-md p-3 group relative">
            <p className="text-xs text-muted-foreground font-body mb-1">
              {getRangeLabel(note.range)}
            </p>
            <p className="text-sm text-foreground font-body leading-relaxed">{note.text}</p>
            <button
              onClick={() => onDeleteNote(note.id)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-5 h-5 text-red-500 cursor-pointer" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
