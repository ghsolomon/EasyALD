import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import DataGrid from 'react-data-grid';
import { fetchNotes, fetchTypes } from '../../store';
import { createPortal } from 'react-dom';
import './styles.css';

const NotesTable = (props) => {
  const [typeColumns, setTypeColumns] = useState([]);
  const mainColumns = [
    {
      key: 'priority',
      name: 'Priority',

      formatter(props) {
        return <b>{props.row.priority} PRIO</b>;
      },

      editor({ row, onRowChange, onClose }) {
        return (
          <select>
            <option value="value1" />
          </select>
        );
        // return createPortal(
        //   <div
        //     className="dialog-container"
        //     onKeyDown={(event) => {
        //       if (event.key === 'Escape') {
        //         onClose();
        //       }
        //     }}
        //   >
        //     <dialog open>
        //       <input
        //         autoFocus
        //         type="range"
        //         min="0"
        //         max="100"
        //         value={row.progress}
        //         onChange={(e) =>
        //           onRowChange({ ...row, progress: e.target.valueAsNumber })
        //         }
        //       />
        //       <menu>
        //         <button onClick={() => onClose()}>Cancel</button>
        //         <button onClick={() => onClose(true)}>Save</button>
        //       </menu>
        //     </dialog>
        //   </div>,
        //   document.body
        // );
      },
      editorOptions: {
        renderFormatter: true,
      },
    },
    { key: 'channels', name: 'Channel' },
    { key: 'positions', name: 'Position' },
    { key: 'description', name: 'Note' },
    { key: 'scenery', name: 'Scenery' },
    { key: 'needs', name: 'Needs' },
  ];
  const [typeCompleteColumns, setTypeCompleteColumns] = useState([]);

  const columns = [...typeColumns, ...mainColumns, ...typeCompleteColumns];

  useEffect(() => {
    props.fetchNotes(props.match.params.projectId);
  }, []);
  useEffect(() => {
    props.fetchTypes(props.match.params.projectId);
  }, []);
  useEffect(() => {
    setTypeColumns(
      props.types.map((type) => ({
        key: type.name,
        name: type.name,
        formatter(props) {
          return <input type="checkbox" />;
        },
      }))
    );
    setTypeCompleteColumns(
      props.types.map((type) => ({
        key: `✔️ ${type.name}`,
        name: `✔️ ${type.name}`,
        formatter(props) {
          return <input type="checkbox" />;
        },
      }))
    );
  }, [props.types]);

  const [sortColumns, setSortColumns] = useState([]);

  const onSortColumnsChange = useCallback((sortColumns) => {
    setSortColumns(sortColumns.slice(-1));
  }, []);

  const sortedRows = useMemo(() => {
    if (!sortColumns.length) return props.notes;

    const { columnKey, direction } = sortColumns[0];

    const sortedRows = [...props.notes];

    return direction === 'DESC' ? sortedRows.reverse() : sortedRows;
  }, [props.notes, sortColumns]);

  return (
    <DataGrid
      rows={sortedRows}
      columns={columns}
      sortColumns={sortColumns}
      onSortColumnsChange={onSortColumnsChange}
    />
  );
};

const mapState = (state) => ({
  notes: state.notes,
  types: state.types,
});

const mapDispatch = (dispatch) => ({
  fetchNotes: (projectId) => dispatch(fetchNotes(projectId)),
  fetchTypes: (projectId) => dispatch(fetchTypes(projectId)),
});

export default connect(mapState, mapDispatch)(NotesTable);
