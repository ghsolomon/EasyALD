import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { connect } from 'react-redux';
import DataGrid, { TextEditor } from 'react-data-grid';
import axios from 'axios';
import { fetchLights } from '../../store';

const columns = [
  {
    key: 'Ch',
    name: 'Channel',
    resizable: true,
    sortable: true,
  },
  {
    key: 'Pur',
    name: 'Purpose',
    resizable: true,
  },
  {
    key: 'Pos',
    name: 'Position',
    resizable: true,
    sortable: true,
  },
  {
    key: 'U#',
    name: 'Unit #',
    resizable: true,
  },
  {
    key: 'Type',
    name: 'Type',
    resizable: true,
  },
  {
    key: 'Load',
    name: 'Load',
    resizable: true,
  },
  {
    key: 'Acc',
    name: 'Accessory',
    resizable: true,
  },
  {
    key: 'Clr',
    name: 'Color',
    resizable: true,
  },
  {
    key: 'Gbo',
    name: 'Gobo',
    resizable: true,
  },
  {
    key: 'LW',
    name: 'LW ID',
    resizable: true,
  },
];

const LightsTable = (props) => {
  useEffect(() => {
    props.fetchLights(props.match.params.projectId);
  }, []);

  const [sortColumns, setSortColumns] = useState([]);

  const onSortColumnsChange = useCallback((sortColumns) => {
    setSortColumns(sortColumns.slice(-1));
  }, []);

  const sortedRows = useMemo(() => {
    if (sortColumns.length === 0) return props.lights;
    const { columnKey, direction } = sortColumns[0];

    const sortedRows = [...props.lights];

    switch (columnKey) {
      case 'Ch':
        sortedRows.sort(
          (light1, light2) => Number(light1.Ch) - Number(light2.Ch)
        );
        break;
      case 'Pos':
        sortedRows.sort((light1, light2) => {
          if (light1.PosOrd > light2.PosOrd) {
            return 1;
          } else if (light1.PosOrd < light2.PosOrd) {
            return -1;
          } else {
            return light1.LtOrd - light2.LtOrd;
          }
        });
        break;
      default:
    }
    return direction === 'DESC' ? sortedRows.reverse() : sortedRows;
  }, [props.lights, sortColumns]);

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
  lights: state.lights,
});

const mapDispatch = (dispatch) => ({
  fetchLights: (projectId) => dispatch(fetchLights(projectId)),
});

export default connect(mapState, mapDispatch)(LightsTable);
