import React from 'react';

import { Autocomplete, Checkbox, TextField } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { connect } from 'react-redux';

const TypeFilter = ({ types }) => (
  <Autocomplete
    multiple
    options={types}
    disableCloseOnSelect
    getOptionLabel={(type) => type.name}
    onChange={(evt) => {
      console.log(evt.target.value);
    }}
    renderOption={(props, type, { selected }) => (
      <li {...props}>
        <Checkbox
          icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
          checkedIcon={<CheckBoxIcon fontSize="small" />}
          style={{ marginRight: 8 }}
          checked={selected}
        />
        {type.name}
      </li>
    )}
    style={{ width: 500 }}
    renderInput={(params) => (
      <TextField {...params} label="Types" placeholder="Types" />
    )}
  />
);

const mapState = (state) => ({ types: state.types });

export default connect(mapState)(TypeFilter);
