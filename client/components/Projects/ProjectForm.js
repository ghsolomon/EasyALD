import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { addProject } from '../../store';

const ProjectForm = (props) => {
  const [formData, setFormData] = useState({
    name: '',
  });

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleCancel = () => {
    props.history.goBack();
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    props.addProject(formData);
  };

  return (
    <Container>
      <Stack sx={{ margin: 1 }} spacing={1}>
        <Typography variant="h3">New Project</Typography>
        <Paper>
          <Box
            component="form"
            sx={{ padding: 5 }}
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <TextField
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  label="Project Name"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item sx={{ textAlign: 'right' }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!formData.name.length}
                >
                  Add Project
                </Button>
                <Button variant="outlined" onClick={handleCancel}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Stack>
    </Container>
  );
};

const mapDispatch = (dispatch) => ({
  addProject: (project) => dispatch(addProject(project)),
});

export default connect(null, mapDispatch)(ProjectForm);
