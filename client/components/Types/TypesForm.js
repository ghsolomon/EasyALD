import React, { useEffect, useReducer, useState } from 'react';
import { connect } from 'react-redux';
import { fetchTypes, addType, updateTypes, deleteType } from '../../store';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AddTaskIcon from '@mui/icons-material/AddTask';
import SaveIcon from '@mui/icons-material/Save';

import { Button, IconButton, TextField, Typography } from '@mui/material';

const reducer = (types = [], payload) => {
  if (Array.isArray(payload)) {
    return payload.map((type, index) => ({ ...type, sortOrder: index }));
  } else {
    return types.map((type) => (type.id === payload.id ? payload : type));
  }
};

const TypesForm = (props) => {
  const [types, setTypes] = useReducer(reducer, []);

  useEffect(() => {
    props.fetchTypes(props.match.params.projectId);
  }, []);

  useEffect(() => {
    setTypes(props.types);
  }, [props.types]);

  const handleOnDragEnd = (result) => {
    const items = types.slice();
    const [reorderedType] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedType);
    setTypes(items);
  };

  // Save changes
  const handleSaveChanges = (evt) => {
    evt.preventDefault();
    props.updateTypes(types);
  };

  // Add new type
  const defaultNewType = {
    name: '',
    color: '#FFFFFF',
    projectId: +props.match.params.projectId,
  };

  const [newType, setNewType] = useState(defaultNewType);

  const handleAddType = (evt) => {
    evt.preventDefault();
    props.addType({
      ...newType,
      sortOrder: types.length,
    });
    setNewType(defaultNewType);
  };

  const handleChangeNewType = (evt) => {
    setNewType({ ...newType, [evt.target.name]: evt.target.value });
  };

  const unsavedChanges = JSON.stringify(types) !== JSON.stringify(props.types);

  return (
    <div className="types-container">
      <form className="types-form" onSubmit={handleSaveChanges}>
        {unsavedChanges && (
          <Button
            variant="contained"
            type="submit"
            disabled={!unsavedChanges}
            startIcon={<SaveIcon />}
          >
            Save changes
          </Button>
        )}
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="types">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {types.map((type, index) => (
                  <Draggable
                    key={type.id}
                    draggableId={String(type.id)}
                    index={index}
                  >
                    {(provided) => (
                      <fieldset
                        className="type-card"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <DragHandleIcon />
                        <TextField
                          label="name"
                          type="text"
                          name="name"
                          value={type.name}
                          onChange={(evt) =>
                            setTypes({
                              ...type,
                              [evt.target.name]: evt.target.value,
                            })
                          }
                        />

                        <input
                          className="type-color-picker"
                          type="color"
                          name="color"
                          value={type.color}
                          onChange={(evt) =>
                            setTypes({
                              ...type,
                              [evt.target.name]: evt.target.value,
                            })
                          }
                        />
                        <IconButton
                          type="button"
                          onClick={() => props.deleteType(type)}
                          variant="contained"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </fieldset>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </form>
      <form onSubmit={handleAddType}>
        <fieldset className="type-card">
          <AddTaskIcon sx={{ visibility: 'hidden' }} />
          <TextField
            type="text"
            name="name"
            onChange={handleChangeNewType}
            value={newType.name}
          />
          <input
            className="type-color-picker"
            type="color"
            name="color"
            onChange={handleChangeNewType}
            value={newType.color}
          />
          <IconButton type="submit">
            <AddIcon />
          </IconButton>
        </fieldset>
      </form>
    </div>
  );
};

const mapState = (state) => ({ types: state.types });

const mapDispatch = (dispatch) => ({
  fetchTypes: (projectId) => dispatch(fetchTypes(projectId)),
  addType: (type) => dispatch(addType(type)),
  updateTypes: (types) => dispatch(updateTypes(types)),
  deleteType: (type) => dispatch(deleteType(type)),
});

export default connect(mapState, mapDispatch)(TypesForm);
