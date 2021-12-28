import React, { useEffect, useReducer } from 'react';
import { connect } from 'react-redux';
import { fetchTypes } from '../../store';

const reducer = (types = [], payload) => {
  if (Array.isArray(payload)) {
    return payload;
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

  return (
    <form>
      {types.map((type) => (
        <fieldset key={type.id}>
          <input
            type="text"
            name="name"
            value={type.name}
            onChange={(evt) =>
              setTypes({ ...type, [evt.target.name]: evt.target.value })
            }
          />
          <input
            type="color"
            name="color"
            value={type.color}
            onChange={(evt) =>
              setTypes({ ...type, [evt.target.name]: evt.target.value })
            }
          />
        </fieldset>
      ))}
    </form>
  );
};

const mapState = (state) => ({ types: state.types });

const mapDispatch = (dispatch) => ({
  fetchTypes: (projectId) => dispatch(fetchTypes(projectId)),
});

export default connect(mapState, mapDispatch)(TypesForm);
