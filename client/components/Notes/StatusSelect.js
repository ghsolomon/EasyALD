import React, { useState } from 'react';
import BuildIcon from '@mui/icons-material/Build';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
} from '@mui/material';

const ACTIVE = 'Active',
  DISCUSS = 'Discuss',
  ON_HOLD = 'On Hold';

const STATUS_ICONS = {
  [ACTIVE]: <BuildIcon />,
  [DISCUSS]: <ChatBubbleIcon />,
  [ON_HOLD]: <PauseCircleIcon />,
};

const StatusSelect = ({ status, handleSelect }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = !!anchorEl;

  const StatusItem = ({ status }) => (
    <ListItem>
      <ListItemButton
        onClick={() => {
          handleClose();
          handleSelect(status);
        }}
      >
        <ListItemIcon>{STATUS_ICONS[status]}</ListItemIcon>
        <ListItemText primary={status} />
      </ListItemButton>
    </ListItem>
  );

  return (
    <>
      <IconButton onClick={handleClick}>{STATUS_ICONS[status]}</IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <List>
          <StatusItem status={ACTIVE} />
          <StatusItem status={DISCUSS} />
          <StatusItem status={ON_HOLD} />
        </List>
      </Popover>
    </>
  );
};

export default StatusSelect;
