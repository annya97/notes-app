import 'bootstrap/dist/css/bootstrap.min.css';
import { useMemo } from 'react';
import { Container } from 'react-bootstrap';
import { Routes, Route, Navigate } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import { NoteList } from './NoteList';
import { NewNote } from './NewNote';
import { NoteLayout } from './NoteLayout';
import { Note } from './Note';
import { EditNote } from './EditNote';
import { useLocalStorage } from './useLocalStorage';

export type Tag = {
  id: string,
  label: string
};

export type NoteData = {
  title: string,
  markdown: string,
  tags: Tag[]
};

export type Note = {
  id: string
} & NoteData;

export type RawNoteData = {
  title: string,
  markdown: string,
  tagIds: string[]
};

export type RawNote = {
  id: string
} & RawNoteData;

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>('NOTES', []);
  const [tags, setTags] = useLocalStorage<Tag[]>('TAGS', []);

  const notesWithTags = useMemo(() => notes.map(note =>
    ({
      ...note,
      tags: tags.filter(tag => note.tagIds.includes(tag.id))
    })
  ), [notes, tags]);

  function onCreateNote({tags, ...data}: NoteData) {
    setNotes(prevNotes =>
      [
        ...prevNotes,
        {
          ...data,
          id: uuidV4(),
          tagIds: tags.map(tag => tag.id)
        }
      ]
    );
  }

  function onUpdateNote(id: string, {tags, ...data}: NoteData) {
    setNotes(prevNotes => (
      prevNotes.map(note => {
        if (note.id === id) {
          return {
            ...note,
            ...data,
            tagIds: tags.map(tag => tag.id)
          };
        }
        else {
          return note;
        }
      })
    ));
  }

  function onDeleteNote(id: string) {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
  }

  function onAddTag(tag: Tag) {
    setTags(prev => [...prev, tag]);
  }
  
  return (
    <Container className="my-4">
      <Routes>
        <Route
          path="/"
          element={
            <NoteList
              notes={notesWithTags}
              availableTags={tags}
            />
          }
        />
        <Route
          path="/new"
          element={
            <NewNote
              onSubmit={onCreateNote}
              onAddTag={onAddTag}
              availableTags={tags}
            />
          }
        />
        <Route
          path="/:id"
          element={<NoteLayout notes={notesWithTags} />}
        >
          <Route index element={<Note onDelete={onDeleteNote} />} />
          <Route
            path="edit"
            element={
              <EditNote
                onSubmit={onUpdateNote}
                onAddTag={onAddTag}
                availableTags={tags}
              />
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
}

export default App;
