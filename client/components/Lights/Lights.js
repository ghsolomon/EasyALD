import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { connect } from 'react-redux';
import { LightsTable, RawLightsTable } from './';
import axios from 'axios';
import { fetchLights, deleteLights } from '../../store';
import csv from 'csvtojson';
import CircularProgress from '@mui/material/CircularProgress';
import UploadIcon from '@mui/icons-material/Upload';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

const Lights = (props) => {
  useEffect(() => {
    props.fetchLights(props.match.params.projectId);
  }, []);

  const [showDialog, setShowDialog] = useState(false);
  const defaultDialog = {
    title: '',
    message: '',
    action: '',
    actionButtons: [],
    defunctLights: [],
  };
  const [dialog, setDialog] = useState(defaultDialog);
  const [actionRows, setActionRows] = useState(new Set());
  const handleClose = () => {
    setShowDialog(false);
    setDialog(defaultDialog);
    setActionRows(new Set());
  };

  const handleUpload = (evt) => {
    const file = evt.target.files[0];
    evt.target.value = null;
    if (file) {
      const reader = new FileReader();
      reader.addEventListener('load', async () => {
        try {
          setDialog((dialog) => ({ ...dialog, title: 'Upload lights' }));
          setShowDialog(true);
          const lights = await csv({
            colParser: {
              Load: 'number',
              'C#': 'number',
              LtOrd: 'number',
              Univ: 'number',
              DMX: 'number',
              PosOrd: 'Number',
            },
            ignoreEmpty: true,
          }).fromString(reader.result);
          // Post lights in batches of 100 to avoid oversized payload
          const createdLights = [];
          for (let i = 0; i < lights.length; i += 100) {
            const { data } = await axios.post(
              `/api/projects/${props.match.params.projectId}/lights`,
              lights.slice(i, i + 100)
            );
            createdLights.push(...data);
          }
          props.fetchLights(props.match.params.projectId);
          const { data: newLights } = await axios.get(
            `/api/projects/${props.match.params.projectId}/lights`
          );

          setDialog((dialog) => ({
            ...dialog,
            message: `Successfully submitted ${createdLights.length} light${
              createdLights.length === 1 ? '' : 's'
            }.`,
          }));

          if (newLights.length > createdLights.length) {
            const defunctLights = newLights.filter(
              (newLight) =>
                !createdLights.some((light) => light.id === newLight.id)
            );
            setActionRows(new Set(defunctLights.map((light) => light.id)));
            setDialog((dialog) => ({
              ...dialog,
              action: `The following ${defunctLights.length} light${
                defunctLights.length === 1 ? '' : 's'
              } seem${
                defunctLights.length !== 1 ? '' : 's'
              } to no longer be in the show.`,
              defunctLights,
              actionButtons: [
                <Button key="1" onClick={handleClose}>
                  Close
                </Button>,
              ],
            }));
          } else {
            setDialog((dialog) => ({
              ...dialog,
              actionButtons: [
                <Button key="1" onClick={handleClose}>
                  Ok
                </Button>,
              ],
            }));
          }
        } catch (error) {
          setDialog((dialog) => ({
            ...dialog,
            message:
              'There was a problem uploading your lights.  Please try again.',
            actionButtons: [
              <Button key="1" onClick={handleClose}>
                Ok
              </Button>,
            ],
          }));
        }
      });
      reader.readAsText(file);
    }
  };

  const [selectedRows, setSelectedRows] = useState(new Set());

  return (
    <>
      <div className="lights-container">
        <div className="lights-header">
          <label htmlFor="upload-lw-csv">
            <input
              type="file"
              id="upload-lw-csv"
              style={{ display: 'none' }}
              onChange={handleUpload}
            />
            <Button
              startIcon={<UploadIcon />}
              component="span"
              variant="contained"
            >
              Upload CSV from LightWright
            </Button>
          </label>
        </div>
        <LightsTable
          className="lights-table"
          extended
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
        />
        <div className="lights-footer">
          {!!selectedRows.size && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                setDialog((dialog) => ({
                  ...dialog,
                  title: 'Delete lights',
                  message: `Are you sure you wish to delete ${
                    selectedRows.size
                  } light${
                    selectedRows.size > 1 && 's'
                  }?  If previously assigned to note(s), ${
                    selectedRows.size > 1 ? 'they' : 'it'
                  } will no longer be attached.  This is not undoable.`,
                  actionButtons: [
                    <Button key="1" onClick={handleClose}>
                      Cancel
                    </Button>,
                    <Button
                      key="2"
                      onClick={() => {
                        props.deleteLights(props.match.params.projectId, [
                          ...selectedRows,
                        ]);
                        setSelectedRows(new Set());
                        handleClose();
                      }}
                    >
                      Confirm Delete
                    </Button>,
                  ],
                }));
                setShowDialog(true);
              }}
            >
              Delete {selectedRows.size} light{selectedRows.size > 1 && 's'}
            </Button>
          )}
        </div>
      </div>
      <Dialog open={showDialog}>
        <DialogTitle>{dialog.title}</DialogTitle>
        <DialogContent>
          {!dialog.message && (
            <div style={{ textAlign: 'center' }}>
              <CircularProgress />
            </div>
          )}
          <DialogContentText>{dialog.message}</DialogContentText>
          <DialogContentText>{dialog.action}</DialogContentText>
          {!!dialog.defunctLights.length && (
            <RawLightsTable
              hideFilters
              extended
              selectedRows={actionRows}
              setSelectedRows={setActionRows}
              noteLights={dialog.defunctLights.map((light) => ({ light }))}
            />
          )}
        </DialogContent>
        <DialogActions>
          {!!actionRows.size && (
            <Button
              color="error"
              onClick={async () => {
                handleClose();
                props.deleteLights(props.match.params.projectId, [
                  ...actionRows,
                ]);
              }}
            >
              Delete {actionRows.size} light{actionRows.size > 1 && 's'}
            </Button>
          )}
          {dialog.actionButtons.map((button) => button)}
        </DialogActions>
      </Dialog>
    </>
  );
};

const mapState = (state) => ({
  lights: state.lights,
});

const mapDispatch = (dispatch) => ({
  fetchLights: (projectId) => dispatch(fetchLights(projectId)),
  deleteLights: (projectId, lightIds) =>
    dispatch(deleteLights(projectId, lightIds)),
});

export default connect(mapState, mapDispatch)(Lights);
