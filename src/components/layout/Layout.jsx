import React from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useApp } from '../../context/AppContext';

const Layout = ({ children }) => {
  const { sidebarOpen } = useApp();

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: sidebarOpen ? '240px' : 0,
          transition: 'margin 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 