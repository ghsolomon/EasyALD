import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MoreVertIcon from '@mui/icons-material/MoreVert';

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

      <SpeedDial
        ariaLabel="Menu"
        sx={{ position: 'fixed', bottom: '1%', right: '1%' }}
        icon={
          <SpeedDialIcon icon={<MoreHorizIcon />} openIcon={<MoreVertIcon />} />
        }
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
    </>
  );
}
