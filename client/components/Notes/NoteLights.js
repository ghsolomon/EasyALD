import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { connect } from 'react-redux';
import DataGrid, { TextEditor } from 'react-data-grid';

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
    key: 'Pos & U#',
    name: 'Position',
    resizable: true,
    sortable: true,
  },
  {
    key: 'Type & Acc & Load',
    name: 'Type / Acc / Load',
    resizable: true,
  },
  {
    key: 'Clr & Gbo',
    name: 'Color / Gobo',
    resizable: true,
  },
];

const NoteLights = (props) => {
  const typeColumns = props.types.map((type) => ({
    key: type.id,
    name: type.name[0],
  }));

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

export default connect(mapState)(NoteLights);
