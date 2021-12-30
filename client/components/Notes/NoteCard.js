import React from 'react';

const NoteCard = (props) => {
  console.log(props);
  const positions = [...new Set(props.lights.map((light) => light.Pos))];
  // const types = props.types.map((type) => type.name);
  return (
    <div className="notecard">
      <input type="text" defaultValue="TYPES" />
      <div>{props.description}</div>
      <div>Position: {positions.join(', ')}</div>
      <div>
        Types:{' '}
        {props.notesTypes.map((notesType) => (
          <label htmlFor={notesType.typeId} key={notesType.typeId}>
            <input
              type="checkbox"
              id={notesType.typeId}
              defaultChecked={notesType.isComplete}
            />
            {notesType.type.name}
          </label>
        ))}
      </div>
    </div>
  );
};

export default NoteCard;
