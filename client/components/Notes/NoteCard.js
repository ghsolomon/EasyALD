import React, { useState } from 'react';
import { connect } from 'react-redux';
import { stringifyChannelList } from '../../utils/helpers';
import { FormControlLabel, Checkbox, Collapse } from '@mui/material';
import { addTypeToNote, removeTypeFromNote, setTypeStatus } from '../../store';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import BalloonEditor from '@ckeditor/ckeditor5-build-balloon';
import NoteLights from './NoteLights';

const NoteCard = (props) => {
  const positions = [...new Set(props.lights.map((light) => light.Pos))].join(
    ', '
  );
  const channels = stringifyChannelList(
    props.lights.map((light) => light.Ch).sort((a, b) => +a - +b)
  );

  const typeStatus = {};
  for (let type of props.noteTypes) {
    typeStatus[type.typeId] = type.isComplete ? 'complete' : 'assigned';
  }

  const [showLights, setShowLights] = useState(false);

  // const types = props.types.map((type) => type.name);
  return (
    <div className="notecard">
      <div className="notecard-header">
        <div className="notecard-header-info">
          <div className="notecard-positions">{positions}</div>
          <div className="notecard-channels">{channels}</div>
        </div>
      </div>
      <div className="notecard-note-description">
        <CKEditor
          editor={BalloonEditor}
          data={props.description}
          config={{
            toolbar: [
              'bold',
              'italic',
              'undo',
              'redo',
              'numberedList',
              'bulletedList',
            ],
          }}
          onReady={(editor) => {
            // You can store the "editor" and use when it is needed.
            console.log('Editor is ready to use!', editor);
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            console.log({ event, editor, data });
          }}
          onBlur={(event, editor) => {
            console.log('Blur.', editor);
            console.log(editor.getData());
          }}
          onFocus={(event, editor) => {
            console.log('Focus.', editor);
          }}
        />
      </div>

      {/* <button onClick={props.handleEditNote}>EDIT</button> */}
      <div className="notecard-lights">
        <button onClick={() => setShowLights(!showLights)}>Show lights</button>
        <Collapse in={showLights}>
          <NoteLights lights={props.lights} />
        </Collapse>
      </div>

      <div className="notecard-types">
        {props.types.map((type) => (
          <FormControlLabel
            key={type.id}
            label={type.name}
            control={
              <Checkbox
                checked={typeStatus[type.id] === 'complete'}
                indeterminate={typeStatus[type.id] === 'assigned'}
                onChange={() => {
                  if (typeStatus[type.id] === 'assigned') {
                    props.setTypeStatus(
                      props.projectId,
                      props.id,
                      type.id,
                      true
                    );
                  } else if (typeStatus[type.id] === 'complete') {
                    props.removeType(props.projectId, props.id, type.id);
                  } else {
                    props.addType(props.projectId, props.id, type.id);
                  }
                }}
                sx={{
                  color: type.color,
                  '&.Mui-checked': { color: type.color },
                  '&.MuiCheckbox-indeterminate': { color: type.color },
                }}
              />
            }
          />
        ))}
      </div>
    </div>
  );
};

const mapState = (state) => ({ types: state.types });

const mapDispatch = (dispatch) => ({
  addType: (projectId, noteId, typeId) =>
    dispatch(addTypeToNote(projectId, noteId, typeId)),
  removeType: (projectId, noteId, typeId) =>
    dispatch(removeTypeFromNote(projectId, noteId, typeId)),
  setTypeStatus: (projectId, noteId, typeId, isComplete) =>
    dispatch(setTypeStatus(projectId, noteId, typeId, isComplete)),
});

export default connect(mapState, mapDispatch)(NoteCard);
