"use client";

import NoteCard from "@/components/notes/NoteCard";

interface Note {
  id: string;
  title: string;
  preview: string;
  author: string;
  time: string;
  tags: string[];
  color: string;
}

interface NotesListProps {
  notes: Note[];
  onSelect: (id: string) => void;
}

export default function NotesList({ notes, onSelect }: NotesListProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-base-content/40 text-sm">No notes found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {notes.map((note) => (
        <NoteCard key={note.id} {...note} onClick={onSelect} />
      ))}
    </div>
  );
}