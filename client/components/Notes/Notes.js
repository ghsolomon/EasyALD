import React, { useEffect } from 'react';
import NoteCard from './NoteCard';
import { connect } from 'react-redux';
import { fetchNotes } from '../../store';

class SingleNote {
  constructor(light, note) {
    this.note = note;
    for (let prop in light) {
      this[prop] = light[prop];
    }
  }
}

const Notes = (props) => {
  useEffect(() => props.fetchNotes(props.match.params.projectId), []);
  const rippleNotes = [];
  for (let note of props.notes) {
    if (!note.lights.length) rippleNotes.push(new SingleNote({}, note));
    for (let light of note.lights) {
      rippleNotes.push(new SingleNote(light, note));
    }
  }

  console.log(rippleNotes);

  return props.notes.map((note) => <NoteCard key={note.id} {...note} />);
};

const mapState = (state) => ({ notes: state.notes });

const mapDispatch = (dispatch) => ({
  fetchNotes: (projectId) => dispatch(fetchNotes(projectId)),
});

export default connect(mapState, mapDispatch)(Notes);
