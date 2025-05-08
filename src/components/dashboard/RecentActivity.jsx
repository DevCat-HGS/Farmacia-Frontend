import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { Input, Output } from '@mui/icons-material';
import { inputApi, outputApi } from '../../services/api';
import { useApp } from '../../context/AppContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const { setLoading, setError } = useApp();

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const [inputs, outputs] = await Promise.all([
        inputApi.getAll(),
        outputApi.getAll(),
      ]);

      const allActivities = [
        ...inputs.data.map(input => ({
          type: 'input',
          date: new Date(input.createdAt),
          product: input.batch.product.name,
          quantity: input.quantity,
          batch: input.batch.number,
        })),
        ...outputs.data.map(output => ({
          type: 'output',
          date: new Date(output.createdAt),
          product: output.batch.product.name,
          quantity: output.quantity,
          batch: output.batch.number,
        })),
      ];

      allActivities.sort((a, b) => b.date - a.date);
      setActivities(allActivities.slice(0, 10));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Actividad Reciente
      </Typography>
      <List>
        {activities.map((activity, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              {activity.type === 'input' ? (
                <Input color="primary" />
              ) : (
                <Output color="secondary" />
              )}
            </ListItemIcon>
            <ListItemText
              primary={`${activity.product} - Lote ${activity.batch}`}
              secondary={`${activity.type === 'input' ? 'Entrada' : 'Salida'} de ${
                activity.quantity
              } unidades - ${format(activity.date, 'dd/MM/yyyy HH:mm', {
                locale: es,
              })}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default RecentActivity; 