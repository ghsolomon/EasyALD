import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { connect } from 'react-redux';
import DataGrid, { SelectColumn, TextEditor } from 'react-data-grid';
import { Checkbox, Button } from '@mui/material';
import { removeLightsFromNote, setNoteLightTypeComplete } from '../../store';
import DeleteIcon from '@mui/icons-material/Delete';

const columns = [
  {
    key: 'Ch',
    name: 'Ch',
    resizable: true,
    sortable: true,
    formatter({ row }) {
      return row.light.Ch;
    },
  },
  {
    key: 'Pur',
    name: 'Purpose',
    resizable: true,
    sortable: true,
    formatter({ row }) {
      return row.light.Pur;
    },
  },
  {
    key: 'Pos & U#',
    name: 'Position',
    resizable: true,
    sortable: true,
    formatter({ row }) {
      return row.light['Pos & U#'];
    },
  },
  {
    key: 'Type & Acc & Load',
    name: 'Type / Acc / Load',
    resizable: true,
    sortable: true,
    formatter({ row }) {
      return row.light['Type & Acc & Load'];
    },
  },
  {
    key: 'Clr & Gbo',
    name: 'Color / Gobo',
    resizable: true,
    sortable: true,
    formatter({ row }) {
      return row.light['Clr & Gbo'];
    },
  },
];

const NoteLightsTable = ({
  projectId,
  noteId,
  noteLights,
  noteTypes = [],
  ...props
}) => {
  const typeColumns = noteTypes.map((noteType) => ({
    key: noteType.type.id,
    name: noteType.type.name,
    width: 1,
    formatter({ row }) {
      const isComplete = row.noteLightTypes.find(
        (noteLightType) => noteLightType.noteTypeId === noteType.id
      ).isComplete;
      return (
        <Checkbox
          checked={isComplete}
          sx={{
            color: noteType.type.color,
            margin: 0,
            padding: 0,
            '&.Mui-checked': { color: noteType.type.color },
            '&.MuiCheckbox-indeterminate': { color: noteType.type.color },
            '& .MuiSvgIcon-root': { fontSize: '1rem' },
          }}
          onChange={(evt) => {
            props.setNoteLightTypeComplete(
              projectId,
              row.noteId,
              row.light.id,
              noteType.typeId,
              evt.target.checked
            );
          }}
        />
      );
    },
  }));

  const [sortColumns, setSortColumns] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());

  const onSortColumnsChange = useCallback((sortColumns) => {
    setSortColumns(sortColumns.slice(-1));
  }, []);

  const sortedRows = useMemo(() => {
    if (sortColumns.length === 0) return noteLights;
    const { columnKey, direction } = sortColumns[0];

    const sortedRows = [...noteLights];

    switch (columnKey) {
      case 'Ch':
        sortedRows.sort(({ light: a }, { light: b }) =>
          a.Ch === b.Ch
            ? 0
            : a.Ch === null
            ? 1
            : b.Ch === null
            ? -1
            : Number.isNaN(+a.Ch - +b.Ch)
            ? Number.isNaN(+a.Ch)
              ? 1
              : -1
            : +a.Ch - +b.Ch
        );
        break;
      case 'Pos & U#':
        sortedRows.sort((a, b) =>
          a.light.PosOrd > b.light.PosOrd
            ? 1
            : a.light.PosOrd < b.light.PosOrd
            ? -1
            : 0
        );
        break;
      default:
        sortedRows.sort(({ light: a }, { light: b }) =>
          a[columnKey] === b[columnKey]
            ? 0
            : a[columnKey] === null
            ? 1
            : b[columnKey] === null
            ? -1
            : a[columnKey] > b[columnKey]
            ? 1
            : a[columnKey] < b[columnKey]
            ? -1
            : 0
        );
    }
    return direction === 'DESC' ? sortedRows.reverse() : sortedRows;
  }, [noteLights, sortColumns]);

  return (
    <>
      <DataGrid
        rows={sortedRows}
        columns={[SelectColumn, ...columns, ...typeColumns]}
        sortColumns={sortColumns}
        onSortColumnsChange={onSortColumnsChange}
        className="note-lights-table rdg-dark"
        rowHeight={25}
        headerRowHeight={25}
        rowKeyGetter={(row) => row.light.id}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
      />
      {!!selectedRows.size && (
        <Button
          variant="outlined"
          color="error"
          endIcon={<DeleteIcon />}
          onClick={() => {
            props.removeLightsFromNote(projectId, noteId, [...selectedRows]);
            setSelectedRows(new Set());
          }}
        >
          Remove {selectedRows.size}{' '}
          {selectedRows.size > 1 ? 'lights' : 'light'}
        </Button>
      )}
    </>
  );
};

const mapTypes = (state) => ({ types: state.types });
const mapLights = (state) => ({
  noteLights: state.lights.map((light) => ({ light })),
});

const mapDispatch = (dispatch) => ({
  setNoteLightTypeComplete: (projectId, noteId, lightId, typeId, isComplete) =>
    dispatch(
      setNoteLightTypeComplete(projectId, noteId, lightId, typeId, isComplete)
    ),
  removeLightsFromNote: (projectId, noteId, lightIds) =>
    dispatch(removeLightsFromNote(projectId, noteId, lightIds)),
});

export default connect(mapTypes, mapDispatch)(NoteLightsTable);
export const AddLightsTable = connect(mapLights, mapDispatch)(NoteLightsTable);
