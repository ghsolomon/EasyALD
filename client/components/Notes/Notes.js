import React, { useEffect, useReducer, useState } from 'react';
import NoteCard from './NoteCard';
import { connect } from 'react-redux';
import {
  createNote,
  fetchLights,
  fetchNotes,
  fetchTypes,
  sortNotes,
} from '../../store';
import { Button, Modal } from '@mui/material';
import { EditNoteModal } from '.';
import { compareChannels } from '../../../utils/helpers';
import NotesMenu from './NotesMenu';

class SingleNote {
  constructor(light, note) {
    this.note = note;
    for (let prop in light) {
      this[prop] = light[prop];
    }
  }
}

const Notes = (props) => {
  // Manage note updates in local state
  // const SET_NOTES = 'SET_NOTES';
  // const TOGGLE_TYPE = 'TOGGLE_TYPE';
  // const setNotes = (notes) => ({ type: SET_NOTES, notes });
  // const setType = (noteId, typeId) => ({
  //   type: TOGGLE_TYPE,
  //   noteId,
  //   typeId,
  // });
  // const notesReducer = (notes = [], action) => {
  //   switch (action.type) {
  //     case SET_NOTES:
  //       return action.notes;
  //     case TOGGLE_TYPE:
  //       const note = notes.find((note) => note.id === action.noteId);
  //       note.

  //     default:
  //       return notes;
  //   }
  // };
  // const [notes, dispatch] = useReducer(notesReducer, []);

  // Fetch notes on mount
  useEffect(() => {
    props.fetchNotes(props.match.params.projectId);
    props.fetchTypes(props.match.params.projectId);
    props.fetchLights(props.match.params.projectId);
  }, []);

  // Set local state once notes have been fetched
  // useEffect(() => {
  //   dispatch(setNotes(props.notes));
  // }, [props.notes]);

  // const rippleNotes = [];
  // for (let note of props.notes) {
  //   if (!note.lights.length) rippleNotes.push(new SingleNote({}, note));
  //   for (let light of note.lights) {
  //     rippleNotes.push(new SingleNote(light, note));
  //   }
  // }

  const [selectedNote, setSelectedNote] = useState(null);
  const handleCloseEditModal = () => setSelectedNote(null);
  const handleEditNote = (note) => setSelectedNote(note);

  const sortByChan = ({ channel: a }, { channel: b }) => {
    return compareChannels(a, b);
  };

  return (
    <>
      <div className="notes-container">
        <div className="notes-header">
          <Button onClick={() => props.sortNotes(sortByChan)}>
            Sort by chan
          </Button>
        </div>
        <div className="notecards-container">
          {props.notes.map((note) => (
            <NoteCard
              key={note.id}
              {...note}
              handleEditNote={() => handleEditNote(note)}
            />
          ))}
        </div>
        <Modal
          open={!!selectedNote}
          onClose={handleCloseEditModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div>
            <EditNoteModal {...selectedNote} />
          </div>
        </Modal>
      </div>
      <NotesMenu
        handleNewNote={() => props.createNote(props.match.params.projectId)}
        notes={props.notes}
      />
    </>
  );
};

const mapState = (state) => ({ notes: state.notes });

const mapDispatch = (dispatch) => ({
  createNote: (projectId) => dispatch(createNote(projectId)),
  fetchNotes: (projectId) => dispatch(fetchNotes(projectId)),
  fetchTypes: (projectId) => dispatch(fetchTypes(projectId)),
  fetchLights: (projectId) => dispatch(fetchLights(projectId)),
  sortNotes: (compareFn) => dispatch(sortNotes(compareFn)),
});

export default connect(mapState, mapDispatch)(Notes);
