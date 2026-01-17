import React, { useState } from 'react';
import { Note } from '../types';
import { Plus, Save, Trash2 } from 'lucide-react';

interface NotesBoardProps {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

export const NotesBoard: React.FC<NotesBoardProps> = ({ notes, setNotes }) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  
  // Create a new note
  const handleCreateNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: 'Untitled Note',
      content: '',
      updatedAt: Date.now()
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this note?')) {
      setNotes(notes.filter(n => n.id !== id));
      if (selectedNoteId === id) setSelectedNoteId(null);
    }
  };

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(n => n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n));
  };

  const activeNote = notes.find(n => n.id === selectedNoteId);

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6">
      {/* Sidebar List */}
      <div className="w-full md:w-1/3 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="font-bold text-slate-700">My Notes</h2>
          <button 
            onClick={handleCreateNote}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-2 space-y-2">
          {notes.length === 0 && (
            <div className="text-center text-slate-400 text-sm mt-10">No notes created yet.</div>
          )}
          {notes.map(note => (
            <div 
              key={note.id}
              onClick={() => setSelectedNoteId(note.id)}
              className={`p-3 rounded-lg cursor-pointer transition-all border ${
                selectedNoteId === note.id 
                  ? 'bg-blue-50 border-blue-200 shadow-sm' 
                  : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <h3 className={`font-medium text-sm truncate pr-2 ${selectedNoteId === note.id ? 'text-blue-800' : 'text-slate-700'}`}>
                  {note.title || "Untitled"}
                </h3>
                <button onClick={(e) => handleDeleteNote(note.id, e)} className="text-slate-300 hover:text-red-500">
                  <Trash2 size={14} />
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1 truncate">
                {note.content || "No additional text..."}
              </p>
              <span className="text-[10px] text-slate-300 mt-2 block">
                {new Date(note.updatedAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden relative">
        {activeNote ? (
          <>
            <div className="p-4 border-b border-slate-100 flex flex-col gap-2">
              <input 
                type="text" 
                value={activeNote.title}
                onChange={(e) => handleUpdateNote(activeNote.id, { title: e.target.value })}
                className="text-2xl font-bold text-slate-800 placeholder-slate-300 outline-none w-full"
                placeholder="Note Title"
              />
              <div className="text-xs text-slate-400 flex items-center gap-2">
                Last edited: {new Date(activeNote.updatedAt).toLocaleString()}
                <span className="text-green-500 flex items-center gap-1"><Save size={12}/> Saved</span>
              </div>
            </div>
            <textarea
              value={activeNote.content}
              onChange={(e) => handleUpdateNote(activeNote.id, { content: e.target.value })}
              className="flex-1 w-full p-6 outline-none text-slate-600 resize-none leading-relaxed"
              placeholder="Write your note content here..."
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
              <Plus size={32} />
            </div>
            <p>Select a note or create a new one to start writing.</p>
          </div>
        )}
      </div>
    </div>
  );
};