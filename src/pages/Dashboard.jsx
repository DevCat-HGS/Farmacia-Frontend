import React from 'react';
import { Grid, Box } from '@mui/material';
import StatsCards from '../components/dashboard/StatsCards';
import MovementsChart from '../components/dashboard/MovementsChart';
import ProductsChart from '../components/dashboard/ProductsChart';
import RecentActivity from '../components/dashboard/RecentActivity';
import ExpirationAlerts from '../components/dashboard/ExpirationAlerts';

const Dashboard = () => {
  return (
    <Box>
      <StatsCards />
      <Grid container spacing={3} mt={1}>
        <Grid item xs={12} md={8}>
          <MovementsChart />
        </Grid>
        <Grid item xs={12} md={4}>
          <ProductsChart />
        </Grid>
        <Grid item xs={12} md={8}>
          <RecentActivity />
        </Grid>
        <Grid item xs={12} md={4}>
          <ExpirationAlerts />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 