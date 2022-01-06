import React, { useState } from 'react';
import { connect } from 'react-redux';
import { stringifyChannelList, whiteOrBlack } from '../../utils/helpers';
import {
  FormControlLabel,
  Checkbox,
  ToggleButton,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Badge,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

import {
  addTypeToNote,
  removeTypeFromNote,
  setTypeStatus,
  updateNote,
} from '../../store';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import BalloonEditor from '@ckeditor/ckeditor5-build-balloon';
import NoteLightsTable from './NoteLightsTable';
import StatusSelect from './StatusSelect';

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

  const [showSelectTypesModal, setShowSelectTypesModal] = useState(false);

  return (
    <div className="notecard">
      {/* Note Header */}
      <div className="notecard-header">
        <div className="notecard-header-main">
          <div className="notecard-header-status">
            <StatusSelect
              status={props.status}
              handleSelect={(status) =>
                props.updateNote({
                  id: props.id,
                  projectId: props.projectId,
                  status,
                })
              }
            />
          </div>
          <div className="notecard-header-info">
            <div className="notecard-positions">{positions}</div>
            <div className="notecard-channels">{channels}</div>
          </div>
        </div>
        <div className="notecard-header-button">BUTTON</div>
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
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Badge badgeContent={props.noteLights.length} color="primary">
              <LightbulbIcon color="secondary" />
            </Badge>
            <Typography marginLeft={3}>Lights</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <NoteLightsTable
              noteLights={props.noteLights}
              noteTypes={props.noteTypes}
              projectId={props.projectId}
            />
          </AccordionDetails>
        </Accordion>
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
        <IconButton onClick={() => setShowSelectTypesModal(true)}>
          <SettingsIcon />
        </IconButton>
      </div>

      {/* <Modal
        open={showSelectTypesModal}
        onClose={() => setShowSelectTypesModal(false)}
      > */}
      <Dialog
        open={showSelectTypesModal}
        onClose={() => setShowSelectTypesModal(false)}
      >
        <DialogTitle>Set note types</DialogTitle>
        <DialogContent>
          <div className="select-types">
            {props.types.map((type) => (
              <ToggleButton
                key={type.id}
                value={type.id}
                sx={{
                  // backgroundColor: '#FFFFFF',
                  // color: '#000000',
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
                    // backgroundColor: '#FFFFFF',
                    // color: '#000000',
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSelectTypesModal(false)}>Close</Button>
        </DialogActions>
        {/* </div> */}
        {/* </Modal> */}
      </Dialog>
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
  updateNote: (note) => dispatch(updateNote(note)),
});

export default connect(mapState, mapDispatch)(NoteCard);
