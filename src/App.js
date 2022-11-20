import React, { useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import { data } from "./data";
import Split from "react-split";
import { nanoid } from "nanoid";
import "./App.css";

const NOTES_LOCAL_KEY = "notes_local_key";

function App() {
    const saveNotesToLocal = (notes) => {
        try {
            localStorage.setItem(NOTES_LOCAL_KEY, JSON.stringify(notes));
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const getNotesFromLocal = () => {
        return JSON.parse(localStorage.getItem(NOTES_LOCAL_KEY));
    };

    // States
    const [notes, setNotes] = React.useState(getNotesFromLocal() || []);
    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0] && notes[0].id) || ""
    );

    // Effects
    useEffect(() => {
        saveNotesToLocal(notes);
    }, [notes]);

    // Handles
    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here",
        };
        setNotes((prevNotes) => [newNote, ...prevNotes]);
        setCurrentNoteId(newNote.id);
    }

    function updateNote(text) {
        setNotes((oldNotes) => {
            const orderedNotes = []
            for (let index = 0; index < oldNotes.length; index++) {
                const oldNote = oldNotes[index];
                if (oldNote.id === currentNoteId) {
                    orderedNotes.unshift({...oldNote, body:text})
                } else {
                    orderedNotes.push(oldNote)
                }
            }
            return orderedNotes;
        });
    }

    function findCurrentNote() {
        return (
            notes.find((note) => {
                return note.id === currentNoteId;
            }) || notes[0]
        );
    }
    return (
        <main>
            {notes.length > 0 ? (
                <Split
                    sizes={[30, 70]}
                    direction="horizontal"
                    className="split"
                >
                    <Sidebar
                        notes={notes}
                        currentNote={findCurrentNote()}
                        setCurrentNoteId={setCurrentNoteId}
                        newNote={createNewNote}
                    />
                    {currentNoteId && notes.length > 0 && (
                        <Editor
                            currentNote={findCurrentNote()}
                            updateNote={updateNote}
                        />
                    )}
                </Split>
            ) : (
                <div className="no-notes">
                    <h1>You have no notes</h1>
                    <button className="first-note" onClick={createNewNote}>
                        Create one now
                    </button>
                </div>
            )}
        </main>
    );
}

export default App;
