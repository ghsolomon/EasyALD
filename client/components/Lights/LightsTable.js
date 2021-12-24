import React, { useEffect, useState, useMemo, useCallback } from 'react';
// import { DataGrid } from '@mui/x-data-grid';
import DataGrid, { TextEditor } from 'react-data-grid';
import axios from 'axios';

// const columns = [
//   { field: 'Ch', headerName: 'Channel', width: 70 },
//   { field: 'Pur', headerName: 'Purpose', width: 130 },
//   { field: 'lastName', headerName: 'Last name', width: 130 },
//   {
//     field: 'age',
//     headerName: 'Age',
//     type: 'number',
//     width: 90,
//   },
// ];

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

// const LightsTable = () => {
//   const [lights, setLights] = useState([]);
//   useEffect(async () => {
//     const { data: lights } = await axios.get('/api/projects/1/lights');
//     setLights(lights);
//   }, []);
//   return (
//     <div style={{ height: 400, width: '100%' }}>
//       <DataGrid
//         rows={lights}
//         columns={columns}
//         pageSize={5}
//         rowsPerPageOptions={[5]}
//         checkboxSelection
//       ></DataGrid>
//     </div>
//   );
// };

const LightsTable = () => {
  useEffect(async () => {
    const { data: lights } = await axios.get('/api/projects/1/lights');
    setLights(lights);
  }, []);

  const [sortColumns, setSortColumns] = useState([]);

  const [lights, setLights] = useState([]);

  const onSortColumnsChange = useCallback((sortColumns) => {
    setSortColumns(sortColumns.slice(-1));
  }, []);

  const sortedRows = useMemo(() => {
    if (sortColumns.length === 0) return lights;
    const { columnKey, direction } = sortColumns[0];

    let sortedRows = [...lights];

    switch (columnKey) {
      case 'Ch':
        sortedRows = sortedRows.sort(
          (light1, light2) => Number(light1.Ch) - Number(light2.Ch)
        );
        break;
      case 'Pos':
        sortedRows = sortedRows.sort((light1, light2) => {
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
  }, [lights, sortColumns]);

  return (
    <DataGrid
      rows={sortedRows}
      columns={columns}
      sortColumns={sortColumns}
      onSortColumnsChange={onSortColumnsChange}
    />
  );
};

export default LightsTable;
