import React, { useEffect, useReducer } from 'react';
import NoteCard from './NoteCard';
import { connect } from 'react-redux';
import { fetchNotes, fetchTypes } from '../../store';
import { Stack } from '@mui/material';

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
  const SET_NOTES = 'SET_NOTES';
  const TOGGLE_TYPE = 'TOGGLE_TYPE';
  const setNotes = (notes) => ({ type: SET_NOTES, notes });
  const setType = (noteId, typeId) => ({
    type: TOGGLE_TYPE,
    noteId,
    typeId,
  });
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
  }, []);

  // Set local state once notes have been fetched
  // useEffect(() => {
  //   dispatch(setNotes(props.notes));
  // }, [props.notes]);

  const rippleNotes = [];
  for (let note of props.notes) {
    if (!note.lights.length) rippleNotes.push(new SingleNote({}, note));
    for (let light of note.lights) {
      rippleNotes.push(new SingleNote(light, note));
    }
  }

  return (
    <Stack spacing={2}>
      {props.notes.map((note) => (
        <NoteCard key={note.id} {...note} />
      ))}
    </Stack>
  );
};

const mapState = (state) => ({ notes: state.notes });

const mapDispatch = (dispatch) => ({
  fetchNotes: (projectId) => dispatch(fetchNotes(projectId)),
  fetchTypes: (projectId) => dispatch(fetchTypes(projectId)),
});

export default connect(mapState, mapDispatch)(Notes);
