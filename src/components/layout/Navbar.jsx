import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { Menu } from '@mui/icons-material';
import { useApp } from '../../context/AppContext';

const Navbar = () => {
  const { toggleSidebar } = useApp();

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1 
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={toggleSidebar}
          edge="start"
        >
          <Menu />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          Dashboard
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 