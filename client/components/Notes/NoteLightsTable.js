import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { connect } from 'react-redux';
import DataGrid, { SelectColumn, TextEditor } from 'react-data-grid';
import {
  Checkbox,
  Button,
  TextField,
  InputAdornment,
  Autocomplete,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { setNoteLightTypeComplete } from '../../store';
import { parseQueryString } from '../../utils/helpers';

const columns = [
  {
    key: 'Ch',
    name: 'Ch',
    resizable: true,
    sortable: true,
    formatter({ row }) {
      return row.light.Ch;
    },
    // headerRenderer: () => <span>CHANNNEL</span>,
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
  className = '',
  positions,
  projectId,
  noteLights,
  selectedRows,
  setSelectedRows,
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
            : a.Ch.localeCompare(b.Ch, 'en', { numeric: true })
        );
        break;
      case 'Pos & U#':
        sortedRows.sort((a, b) =>
          a.light.PosOrd > b.light.PosOrd
            ? 1
            : a.light.PosOrd < b.light.PosOrd
            ? -1
            : a.light.LtOrd - b.light.LtOrd
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

  const [filterChannels, setFilterChannels] = useState('');
  const [filterPositions, setFilterPositions] = useState('');

  const passesChannelFilter = (filterArr, ch) => {
    if (!filterArr.length) {
      return true;
    }
    const chanToCheck = !Number.isNaN(ch) ? +ch : ch;
    for (let set of filterArr) {
      if (!set.length) {
        return true;
      } else if (set.length === 1) {
        if (set[0] === chanToCheck) {
          return true;
        }
      } else if (set[0] <= chanToCheck && set[1] >= chanToCheck) {
        return true;
      }
    }
    return false;
  };

  const passesPositionFilter = (posFilter, pos) => {
    if (!posFilter.length || pos.toLowerCase().includes(posFilter)) {
      return true;
    } else {
      return false;
    }
  };

  const filteredRows = useMemo(() => {
    const chanArr = parseQueryString(filterChannels);
    const posFilter = filterPositions.toLowerCase();
    return sortedRows.filter(
      (row) =>
        passesChannelFilter(chanArr, row.light.Ch) &&
        passesPositionFilter(posFilter, row.light.Pos)
    );
  }, [sortedRows, filterChannels, filterPositions]);

  return (
    <>
      <div className="table-filters">
        <TextField
          value={filterChannels}
          onChange={(evt) => setFilterChannels(evt.target.value)}
          label="Channel"
          size="small"
          type="search"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Autocomplete
          freeSolo
          disableClearable
          options={positions.map((position) => position.name)}
          onInputChange={(evt, val) => setFilterPositions(val)}
          inputValue={filterPositions}
          size="small"
          sx={{ maxWidth: '50%' }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Position"
              InputProps={{
                ...params.InputProps,
                type: 'search',
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </div>
      <DataGrid
        rows={filteredRows}
        columns={[SelectColumn, ...columns, ...typeColumns]}
        sortColumns={sortColumns}
        onSortColumnsChange={onSortColumnsChange}
        className={`${className} rdg-dark`}
        rowHeight={25}
        headerRowHeight={25}
        rowKeyGetter={(row) => row.light.id}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
      />
    </>
  );
};

const mapTypesAndPos = (state) => ({
  types: state.types,
  positions: state.positions,
});
const mapLightsAndPos = (state) => ({
  noteLights: state.lights.map((light) => ({ light })),
  positions: state.positions,
});

const mapDispatch = (dispatch) => ({
  setNoteLightTypeComplete: (projectId, noteId, lightId, typeId, isComplete) =>
    dispatch(
      setNoteLightTypeComplete(projectId, noteId, lightId, typeId, isComplete)
    ),
});

export default connect(mapTypesAndPos, mapDispatch)(NoteLightsTable);
export const AddLightsTable = connect(
  mapLightsAndPos,
  mapDispatch
)(NoteLightsTable);
