import {
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProject, fetchProjects } from '../../store';
import ProjectOptions from './ProjectOptions';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';

const Projects = ({ projects, fetchProjects, fetchProject }) => {
  useEffect(() => fetchProjects(), []);
  return (
    <Container>
      <Stack sx={{ margin: 1 }} spacing={1}>
        <Typography variant="h3">Projects</Typography>
        <Paper>
          <List>
            {projects.map((project) => (
              <ListItem key={project.id} secondaryAction={<ProjectOptions />}>
                <ListItemButton onClick={() => fetchProject(project.id)}>
                  <ListItemIcon>
                    <TheaterComedyIcon />
                  </ListItemIcon>
                  <ListItemText primary={project.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Stack>
    </Container>
  );
};

const mapState = (state) => ({
  projects: state.projects,
});
const mapDispatch = (dispatch) => ({
  fetchProjects: () => dispatch(fetchProjects()),
  fetchProject: (projectId) => dispatch(fetchProject(projectId)),
});
export default connect(mapState, mapDispatch)(Projects);
