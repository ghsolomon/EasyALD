import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchTypes } from '../../store';

const TypesForm = (props) => {
  useEffect(() => {
    props.fetchTypes(props.match.params.projectId);
  }, []);
  return <div>Types</div>;
};

const mapState = (state) => ({ types: state.types });

const mapDispatch = (dispatch) => ({
  fetchTypes: (projectId) => dispatch(fetchTypes(projectId)),
});

export default connect(mapState, mapDispatch)(TypesForm);
