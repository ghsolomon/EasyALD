import React, { useEffect, useReducer, useState } from 'react';
import { connect } from 'react-redux';
import { fetchTypes, addType, updateTypes } from '../../store';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DragHandleIcon from '@mui/icons-material/DragHandle';

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

  useEffect(() => {
    console.log(types);
  }, [types]);

  const handleOnDragEnd = (result) => {
    console.log(types);
    const items = types.slice();
    const [reorderedType] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedType);
    setTypes(items);
  };

  // Save changes
  const handleSaveChanges = (evt) => {
    evt.preventDefault();
    props.updateTypes(props.match.params.projectId, types);
  };

  // Add new type
  const defaultNewType = { name: '', color: '#FFFFFF' };

  const [newType, setNewType] = useState(defaultNewType);

  const handleAddType = (evt) => {
    evt.preventDefault();
    props.addType(props.match.params.projectId, {
      ...newType,
      sortOrder: types.length,
    });
    setNewType(defaultNewType);
  };

  const handleChangeNewType = (evt) => {
    setNewType({ ...newType, [evt.target.name]: evt.target.value });
  };

  return (
    <>
      <form onSubmit={handleSaveChanges}>
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
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <DragHandleIcon />
                        <input
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
                        <button>Delete</button>
                      </fieldset>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <button
          type="submit"
          disabled={JSON.stringify(types) === JSON.stringify(props.types)}
        >
          Save changes
        </button>
      </form>
      <form onSubmit={handleAddType}>
        <fieldset>
          <input
            type="text"
            name="name"
            onChange={handleChangeNewType}
            value={newType.name}
          />
          <input
            type="color"
            name="color"
            onChange={handleChangeNewType}
            value={newType.color}
          />
          <button type="submit">Add</button>
        </fieldset>
      </form>
    </>
  );
};

const mapState = (state) => ({ types: state.types });

const mapDispatch = (dispatch) => ({
  fetchTypes: (projectId) => dispatch(fetchTypes(projectId)),
  addType: (projectId, type) => dispatch(addType(projectId, type)),
  updateTypes: (projectId, types) => dispatch(updateTypes(projectId, types)),
});

export default connect(mapState, mapDispatch)(TypesForm);
