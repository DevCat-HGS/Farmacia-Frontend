import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { 
  Inventory, 
  Category, 
  Warning, 
  TrendingUp 
} from '@mui/icons-material';
import { productApi, categoryApi, batchApi, inputApi } from '../../services/api';
import { useApp } from '../../context/AppContext';

const StatCard = ({ title, value, icon, color }) => (
  <Paper sx={{ p: 2 }}>
    <Box display="flex" alignItems="center">
      <Box 
        sx={{ 
          backgroundColor: `${color}22`,
          p: 1,
          borderRadius: 1,
          mr: 2
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="h6" component="div">
          {value}
        </Typography>
        <Typography color="textSecondary" variant="body2">
          {title}
        </Typography>
      </Box>
    </Box>
  </Paper>
);

const StatsCards = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    expiringBatches: 0,
    monthlyInputs: 0,
  });
  const { setLoading, setError } = useApp();

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [products, categories, batches, inputs] = await Promise.all([
        productApi.getAll(),
        categoryApi.getAll(),
        batchApi.getAll(),
        inputApi.getAll(),
      ]);

      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      const expiringCount = batches.data.filter(batch => {
        const caducationDate = new Date(batch.caducation);
        return caducationDate <= thirtyDaysFromNow && batch.stock > 0;
      }).length;

      const thisMonth = new Date().getMonth();
      const monthlyInputsCount = inputs.data.filter(input => {
        const inputDate = new Date(input.createdAt);
        return inputDate.getMonth() === thisMonth;
      }).length;

      setStats({
        totalProducts: products.data.length,
        totalCategories: categories.data.length,
        expiringBatches: expiringCount,
        monthlyInputs: monthlyInputsCount,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Productos"
          value={stats.totalProducts}
          icon={<Inventory sx={{ color: '#1976d2' }} />}
          color="#1976d2"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Categorías"
          value={stats.totalCategories}
          icon={<Category sx={{ color: '#2e7d32' }} />}
          color="#2e7d32"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Lotes por Caducar"
          value={stats.expiringBatches}
          icon={<Warning sx={{ color: '#ed6c02' }} />}
          color="#ed6c02"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Entradas del Mes"
          value={stats.monthlyInputs}
          icon={<TrendingUp sx={{ color: '#9c27b0' }} />}
          color="#9c27b0"
        />
      </Grid>
    </Grid>
  );
};

export default StatsCards; 