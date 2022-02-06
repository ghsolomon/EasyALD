import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { SpeedDial, Box, SpeedDialIcon, SpeedDialAction } from '@mui/material';

import NoteAddIcon from '@mui/icons-material/NoteAdd';
import PrintIcon from '@mui/icons-material/Print';
import { PrintNotes } from '../Printouts';

export default function NotesMenu({ handleNewNote, notes }) {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <>
      <div style={{ display: 'none' }}>
        <PrintNotes ref={componentRef} notes={notes} />
      </div>

      <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>
        <SpeedDial
          ariaLabel="Menu"
          sx={{ position: 'absolute', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
        >
          <SpeedDialAction
            key="New Note"
            icon={<NoteAddIcon />}
            tooltipTitle="New Note"
            onClick={handleNewNote}
          />
          <SpeedDialAction
            key="Print"
            icon={<PrintIcon />}
            tooltipTitle="Print"
            onClick={handlePrint}
          />
        </SpeedDial>
      </Box>
    </>
  );
}
