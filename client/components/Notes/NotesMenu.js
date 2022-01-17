import React from 'react';
import { SpeedDial, Box, SpeedDialIcon, SpeedDialAction } from '@mui/material';

import NoteAddIcon from '@mui/icons-material/NoteAdd';
import PrintIcon from '@mui/icons-material/Print';

export default function NotesMenu({ handleNewNote }) {
  const actions = [
    { icon: <NoteAddIcon />, name: 'New Note', onClick: handleNewNote },
    { icon: <PrintIcon />, name: 'Print' },
  ];
  return (
    <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="Menu"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.onClick}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}
