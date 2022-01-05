import React, { useState } from 'react';
import { connect } from 'react-redux';
import { stringifyChannelList, whiteOrBlack } from '../../utils/helpers';
import {
  FormControlLabel,
  Checkbox,
  Collapse,
  Modal,
  ToggleButton,
  IconButton,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import CancelIcon from '@mui/icons-material/Cancel';

import { addTypeToNote, removeTypeFromNote, setTypeStatus } from '../../store';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import BalloonEditor from '@ckeditor/ckeditor5-build-balloon';
import NoteLightsTable from './NoteLightsTable';

const NoteCard = (props) => {
  const positions = [
    ...new Set(props.noteLights.map((noteLight) => noteLight.light.Pos)),
  ].join(', ');
  const channels = stringifyChannelList(
    props.noteLights
      .map((noteLight) => noteLight.light.Ch)
      .sort((a, b) => +a - +b)
  );

  const [COMPLETE, PARTIALLY_COMPLETE, ASSIGNED] = [
    'COMPLETE',
    'PARTIALLY_COMPLETE',
    'ASSIGNED',
  ];

  const typeStatus = {};
  for (let type of props.noteTypes) {
    typeStatus[type.typeId] = type.isComplete
      ? COMPLETE
      : type.isPartiallyComplete
      ? PARTIALLY_COMPLETE
      : ASSIGNED;
  }

  const [showLights, setShowLights] = useState(false);
  const [showSelectTypesModal, setShowSelectTypesModal] = useState(false);

  return (
    <div className="notecard">
      {/* Note Header */}
      <div className="notecard-header">
        <div className="notecard-header-info">
          <div className="notecard-positions">{positions}</div>
          <div className="notecard-channels">{channels}</div>
        </div>
      </div>

      {/* Note Editor */}
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

      {/* Note Lights */}
      <div className="notecard-lights">
        <button onClick={() => setShowLights(!showLights)}>Show lights</button>
        <Collapse in={showLights}>
          <NoteLightsTable
            noteLights={props.noteLights}
            noteTypes={props.noteTypes}
            projectId={props.projectId}
          />
        </Collapse>
      </div>

      {/* Note Types */}
      <div className="notecard-types">
        {props.noteTypes.map((noteType) => (
          <FormControlLabel
            key={noteType.id}
            label={noteType.type.name}
            control={
              <Checkbox
                checked={noteType.isComplete}
                indeterminate={
                  !noteType.isComplete && noteType.isPartiallyComplete
                }
                onChange={() => {
                  props.setTypeStatus(
                    props.projectId,
                    props.id,
                    noteType.type.id,
                    !noteType.isComplete
                  );
                }}
                sx={{
                  color: noteType.type.color,
                  '&.Mui-checked': { color: noteType.type.color },
                  '&.MuiCheckbox-indeterminate': { color: noteType.type.color },
                }}
              />
            }
          />
        ))}
        <IconButton
          onClick={() => setShowSelectTypesModal(true)}
          color="primary"
        >
          <SettingsIcon />
        </IconButton>
      </div>

      <Modal
        open={showSelectTypesModal}
        onClose={() => setShowSelectTypesModal(false)}
      >
        <div className="select-types-modal">
          <div className="modal-close-icon">
            <CancelIcon onClick={() => setShowSelectTypesModal(false)} />
          </div>
          {props.types.map((type) => (
            <ToggleButton
              key={type.id}
              value={type.id}
              sx={{
                backgroundColor: '#FFFFFF',
                color: '#000000',
                borderColor: type.color,
                '&.Mui-selected': {
                  backgroundColor: type.color,
                  color: whiteOrBlack(type.color),
                  '&:hover': {
                    backgroundColor: type.color,
                    color: whiteOrBlack(type.color),
                    filter: 'brightness(85%)',
                  },
                },
                '&:hover': {
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  filter: 'brightness(85%)',
                },
                '&:focusVisible': {
                  backgroundColor: type.color,
                  color: whiteOrBlack(type.color),
                },
              }}
              onClick={() => {
                if (typeStatus[type.id]) {
                  props.removeType(props.projectId, props.id, type.id);
                } else {
                  props.addType(props.projectId, props.id, type.id);
                }
              }}
              selected={!!typeStatus[type.id]}
            >
              {type.name}
            </ToggleButton>
          ))}
        </div>
      </Modal>
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
