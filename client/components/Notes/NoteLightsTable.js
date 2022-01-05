import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { connect } from 'react-redux';
import DataGrid, { TextEditor } from 'react-data-grid';
import { Checkbox } from '@mui/material';
import { setNoteLightTypeComplete } from '../../store';

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
    formatter({ row }) {
      return row.light['Type & Acc & Load'];
    },
  },
  {
    key: 'Clr & Gbo',
    name: 'Color / Gobo',
    resizable: true,
    formatter({ row }) {
      return row.light['Clr & Gbo'];
    },
  },
];

const NoteLightsTable = (props) => {
  const typeColumns = props.noteTypes.map((noteType) => ({
    key: noteType.type.id,
    name: noteType.type.name[0],
    formatter({ row }) {
      const isComplete = row.noteLightTypes.find(
        (noteLightType) => noteLightType.noteTypeId === noteType.id
      ).isComplete;
      return (
        <input
          type="checkbox"
          checked={isComplete}
          // onChange={props.setNoteLightTypeComplete(!isComplete)}
          onChange={(evt) => {
            props.setNoteLightTypeComplete(
              props.projectId,
              row.noteId,
              row.light.id,
              noteType.typeId,
              evt.target.checked
            );
          }}
        />
      );
      // return '';
    },
  }));

  const [sortColumns, setSortColumns] = useState([]);

  const onSortColumnsChange = useCallback((sortColumns) => {
    setSortColumns(sortColumns.slice(-1));
  }, []);

  const sortedRows = useMemo(() => {
    if (sortColumns.length === 0) return props.noteLights;
    const { columnKey, direction } = sortColumns[0];

    const sortedRows = [...props.noteLights];

    switch (columnKey) {
      case 'Ch':
        sortedRows.sort(
          (noteLight1, noteLight2) =>
            Number(noteLight1.light.Ch) - Number(noteLight2.light.Ch)
        );
        break;
      case 'Pos':
        sortedRows.sort((noteLight1, noteLight2) => {
          if (noteLight1.light.PosOrd > noteLight2.light.PosOrd) {
            return 1;
          } else if (noteLight1.light.PosOrd < noteLight2.light.PosOrd) {
            return -1;
          } else {
            return noteLight1.light.LtOrd - noteLight2.light.LtOrd;
          }
        });
        break;
      default:
    }
    return direction === 'DESC' ? sortedRows.reverse() : sortedRows;
  }, [props.noteLights, sortColumns]);

  return (
    <DataGrid
      rows={sortedRows}
      columns={[...columns, ...typeColumns]}
      sortColumns={sortColumns}
      onSortColumnsChange={onSortColumnsChange}
      className="note-lights-table rdg-dark"
      rowHeight={25}
      headerRowHeight={25}
    />
  );
};

const mapState = (state) => ({ types: state.types });

const mapDispatch = (dispatch) => ({
  setNoteLightTypeComplete: (projectId, noteId, lightId, typeId, isComplete) =>
    dispatch(
      setNoteLightTypeComplete(projectId, noteId, lightId, typeId, isComplete)
    ),
});

export default connect(mapState, mapDispatch)(NoteLightsTable);
