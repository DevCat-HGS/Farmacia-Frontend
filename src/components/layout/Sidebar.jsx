import React from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Box,
  Typography 
} from '@mui/material';
import {
  Dashboard,
  Category,
  Inventory,
  Input,
  Output,
  BatchPrediction
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/' },
  { text: 'Categories', icon: <Category />, path: '/categories' },
  { text: 'Products', icon: <Inventory />, path: '/products' },
  { text: 'Batches', icon: <BatchPrediction />, path: '/batches' },
  { text: 'Inputs', icon: <Input />, path: '/inputs' },
  { text: 'Outputs', icon: <Output />, path: '/outputs' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { sidebarOpen } = useApp();

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={sidebarOpen}
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div">
          Inventory System
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar; 