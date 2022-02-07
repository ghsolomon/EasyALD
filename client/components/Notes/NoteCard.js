import React, { useEffect, useState } from 'react';
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
  Autocomplete,
  TextField,
} from '@mui/material';
import { withStyles } from '@mui/styles';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import {
  addTypeToNote,
  removeTypeFromNote,
  setTypeStatus,
  updateNote,
  removeLightsFromNote,
  addLightsToNote,
  deleteNote,
} from '../../store';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import BalloonEditor from '@ckeditor/ckeditor5-build-balloon';
import { LightsTable, NoteLightsTable } from '../Lights';
import StatusSelect from './StatusSelect';
import NoteCardOptions from './NoteCardOptions';

const summaryStyles = {
  /* Styles applied to the root element. */
  root: {
    minHeight: 7 * 4, //8 * 6
    '&$expanded': {
      minHeight: 64,
    },
  },
  /* Styles applied to the root element if `expanded={true}`. */
  expanded: {},
  /* Styles applied to the children wrapper element. */
  content: {
    margin: 0, //12px 0
    '&$expanded': {
      margin: '20px 0',
    },
  },
};
const CompactSummary = withStyles(summaryStyles)(AccordionSummary);
CompactSummary.muiName = 'AccordionSummary';

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
  const [showAddLightsModal, setShowAddLightsModal] = useState(false);
  const [NLSelectedRows, setNLSelectedRows] = useState(new Set());
  const [ALSelectedRows, setALSelectedRows] = useState(new Set());

  const [channel, setChannel] = useState('');
  const [position, setPosition] = useState('');
  const [PosOrd, setPosOrd] = useState(null);
  const [description, setDescription] = useState(null);

  useEffect(() => {
    setChannel(props.channel || '');
    setPosition(props.position || '');
    setPosOrd(props.PosOrd);
    setDescription(props.description);
  }, []);

  const unsavedChanges =
    description !== props.description ||
    (!props.noteLights.length &&
      (channel !== (props.channel || '') ||
        position !== (props.position || '') ||
        (+PosOrd !== props.PosOrd && PosOrd !== props.PosOrd)));

  const handleUpdate = (evt) => {
    evt.preventDefault();
    if (unsavedChanges) {
      props.updateNote({
        id: props.id,
        projectId: props.projectId,
        channel,
        position,
        PosOrd,
        description,
      });
    }
  };

  return (
    <div
      className={`notecard${unsavedChanges ? ' notecard-unsaved-changes' : ''}`}
    >
      {/* Note Header */}
      <form className="notecard-header" onSubmit={handleUpdate}>
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
            <div className="notecard-positions">
              {positions || (
                <Autocomplete
                  fullWidth
                  freeSolo
                  disableClearable
                  options={props.positions.map((position) => position.name)}
                  onInputChange={(evt, value) => {
                    setPosition(value);
                    const matchingPosition = props.positions.find(
                      (position) => position.name === value
                    );
                    if (matchingPosition) {
                      setPosOrd(matchingPosition.PosOrd);
                    } else {
                      setPosOrd(null);
                    }
                  }}
                  inputValue={position}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Position"
                      size="small"
                      inputProps={{
                        ...params.inputProps,
                        className: 'notecard-positions-field',
                      }}
                    />
                  )}
                />
              )}
            </div>
            <div className="notecard-channels">
              {channels || (
                <TextField
                  fullWidth
                  value={channel}
                  onChange={(evt) => setChannel(evt.target.value)}
                  placeholder="Channel"
                  size="small"
                  inputProps={{ className: 'notecard-channels-field' }}
                />
              )}
            </div>
          </div>
        </div>
        <div className="notecard-header-button">
          {unsavedChanges && (
            <IconButton type="submit">
              <SaveIcon htmlColor="#FF0000" />
            </IconButton>
          )}
          <NoteCardOptions
            handleDelete={() =>
              props.deleteNote({
                id: props.id,
                projectId: props.projectId,
              })
            }
          />
        </div>
      </form>

      {/* Note Editor */}
      <div
        className="notecard-note-description"
        onKeyDown={(evt) => {
          if (evt.key === 's' && evt.metaKey) {
            handleUpdate(evt);
          }
        }}
      >
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
            // const data = editor.getData();
            setDescription(editor.getData());
            // console.log({ event, editor, data });
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
        <Accordion square>
          <CompactSummary expandIcon={<ExpandMoreIcon />}>
            {/* <Badge badgeContent={props.noteLights.length} color="primary">
              <LightbulbIcon color="secondary" />
            </Badge>
            <Typography marginLeft={3}>Lights</Typography> */}
            {props.noteLights.length} Light
            {props.noteLights.length !== 1 && 's'}
          </CompactSummary>
          <AccordionDetails>
            <NoteLightsTable
              className="note-lights-table"
              noteLights={props.noteLights}
              noteTypes={props.noteTypes}
              projectId={props.projectId}
              noteId={props.id}
              selectedRows={NLSelectedRows}
              setSelectedRows={setNLSelectedRows}
              hideFilters
            />
            <div className="table-add-remove-lights">
              <Button
                variant="contained"
                color="success"
                endIcon={<AddIcon />}
                onClick={() => setShowAddLightsModal(true)}
              >
                Add
              </Button>{' '}
              {!!NLSelectedRows.size && (
                <Button
                  variant="outlined"
                  color="error"
                  endIcon={<DeleteIcon />}
                  onClick={() => {
                    props.removeLightsFromNote(props.projectId, props.id, [
                      ...NLSelectedRows,
                    ]);
                    setNLSelectedRows(new Set());
                  }}
                >
                  Remove {NLSelectedRows.size}{' '}
                  {NLSelectedRows.size > 1 ? 'lights' : 'light'}
                </Button>
              )}
            </div>
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
      {/* Show Add Lights Modal */}
      <Dialog
        maxWidth="xl"
        fullWidth
        open={showAddLightsModal}
        onClose={() => setShowAddLightsModal(false)}
      >
        <DialogTitle>Add lights</DialogTitle>
        <DialogContent>
          <LightsTable
            projectId={props.projectId}
            selectedRows={ALSelectedRows}
            setSelectedRows={setALSelectedRows}
          />
        </DialogContent>
        <DialogActions>
          {!!ALSelectedRows.size && (
            <Button
              variant="contained"
              color="success"
              endIcon={<AddIcon />}
              onClick={() => {
                props.addLightsToNote(props.projectId, props.id, [
                  ...ALSelectedRows,
                ]);
                setALSelectedRows(new Set());
                setShowAddLightsModal(false);
              }}
            >
              Add {ALSelectedRows.size}{' '}
              {ALSelectedRows.size > 1 ? 'lights' : 'light'}
            </Button>
          )}
          <Button onClick={() => setShowAddLightsModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Show Select Types Modal */}
      <Dialog
        open={showSelectTypesModal}
        onClose={() => setShowSelectTypesModal(false)}
      >
        <DialogTitle>Set note types</DialogTitle>
        <DialogContent>
          <div className="notecard-select-types">
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
      </Dialog>
    </div>
  );
};

const mapState = (state) => ({
  types: state.types,
  positions: state.positions,
});

const mapDispatch = (dispatch) => ({
  addType: (projectId, noteId, typeId) =>
    dispatch(addTypeToNote(projectId, noteId, typeId)),
  removeType: (projectId, noteId, typeId) =>
    dispatch(removeTypeFromNote(projectId, noteId, typeId)),
  setTypeStatus: (projectId, noteId, typeId, isComplete) =>
    dispatch(setTypeStatus(projectId, noteId, typeId, isComplete)),
  updateNote: (note) => dispatch(updateNote(note)),
  deleteNote: (note) => dispatch(deleteNote(note)),
  addLightsToNote: (projectId, noteId, lightIds) =>
    dispatch(addLightsToNote(projectId, noteId, lightIds)),
  removeLightsFromNote: (projectId, noteId, lightIds) =>
    dispatch(removeLightsFromNote(projectId, noteId, lightIds)),
});

export default connect(mapState, mapDispatch)(NoteCard);
