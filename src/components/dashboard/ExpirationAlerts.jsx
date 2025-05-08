import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  ListItemIcon,
  Chip,
} from '@mui/material';
import { Warning } from '@mui/icons-material';
import { batchApi } from '../../services/api';
import { useApp } from '../../context/AppContext';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

const ExpirationAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const { setLoading, setError } = useApp();

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await batchApi.getAll();
      
      const today = new Date();
      const expiringBatches = response.data
        .filter(batch => {
          const caducationDate = new Date(batch.caducation);
          const daysUntilExpiration = differenceInDays(caducationDate, today);
          return daysUntilExpiration <= 30 && batch.stock > 0;
        })
        .map(batch => ({
          ...batch,
          daysLeft: differenceInDays(new Date(batch.caducation), today),
        }))
        .sort((a, b) => a.daysLeft - b.daysLeft);

      setAlerts(expiringBatches);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const getAlertColor = (days) => {
    if (days <= 0) return 'error';
    if (days <= 7) return 'warning';
    return 'info';
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Alertas de Caducidad
      </Typography>
      <List>
        {alerts.map((batch) => (
          <ListItem key={batch._id}>
            <ListItemIcon>
              <Warning color={getAlertColor(batch.daysLeft)} />
            </ListItemIcon>
            <ListItemText
              primary={`${batch.product.name} - Lote ${batch.number}`}
              secondary={`Caduca: ${format(new Date(batch.caducation), 'dd/MM/yyyy', {
                locale: es,
              })}`}
            />
            <Chip
              label={
                batch.daysLeft <= 0
                  ? 'Caducado'
                  : `${batch.daysLeft} días`
              }
              color={getAlertColor(batch.daysLeft)}
              size="small"
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ExpirationAlerts; 