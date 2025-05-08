import React, { useState, useEffect } from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { ResponsiveLine } from '@nivo/line';
import { inputApi, outputApi } from '../../services/api';
import { useApp } from '../../context/AppContext';
import { format, subDays } from 'date-fns';

const MovementsChart = () => {
  const [data, setData] = useState([]);
  const { setLoading, setError } = useApp();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [inputs, outputs] = await Promise.all([
        inputApi.getAll(),
        outputApi.getAll(),
      ]);

      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = subDays(new Date(), i);
        return format(date, 'yyyy-MM-dd');
      }).reverse();

      const inputsByDay = inputs.data.reduce((acc, input) => {
        const date = format(new Date(input.createdAt), 'yyyy-MM-dd');
        acc[date] = (acc[date] || 0) + input.quantity;
        return acc;
      }, {});

      const outputsByDay = outputs.data.reduce((acc, output) => {
        const date = format(new Date(output.createdAt), 'yyyy-MM-dd');
        acc[date] = (acc[date] || 0) + output.quantity;
        return acc;
      }, {});

      const chartData = [
        {
          id: 'Entradas',
          data: last30Days.map(date => ({
            x: date,
            y: inputsByDay[date] || 0,
          })),
        },
        {
          id: 'Salidas',
          data: last30Days.map(date => ({
            x: date,
            y: outputsByDay[date] || 0,
          })),
        },
      ];

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
        Movimientos Últimos 30 Días
      </Typography>
      <Box sx={{ height: 350 }}>
        <ResponsiveLine
          data={data}
          margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            format: value => format(new Date(value), 'dd/MM'),
          }}
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[
            {
              anchor: 'top-right',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: -20,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 80,
              itemHeight: 20,
              symbolSize: 12,
              symbolShape: 'circle',
            },
          ]}
        />
      </Box>
    </Paper>
  );
};

export default MovementsChart; 