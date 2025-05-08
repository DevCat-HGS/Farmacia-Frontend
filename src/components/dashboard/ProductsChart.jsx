import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { ResponsivePie } from '@nivo/pie';
import { productApi } from '../../services/api';
import { useApp } from '../../context/AppContext';

const ProductsChart = () => {
  const [data, setData] = useState([]);
  const { setLoading, setError } = useApp();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await productApi.getAll();
      
      const productsByCategory = response.data.reduce((acc, product) => {
        const categoryName = product.category.name;
        acc[categoryName] = (acc[categoryName] || 0) + 1;
        return acc;
      }, {});

      const chartData = Object.entries(productsByCategory).map(([label, value]) => ({
        id: label,
        label,
        value,
      }));

      setData(chartData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Paper sx={{ p: 2, height: 400 }}>
      <Typography variant="h6" gutterBottom>
        Productos por Categoría
      </Typography>
      <Box sx={{ height: 350 }}>
        <ResponsivePie
          data={data}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: 56,
              itemsSpacing: 0,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: '#999',
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: 'circle',
            },
          ]}
        />
      </Box>
    </Paper>
  );
};

export default ProductsChart; 