// src/app/distribution/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { ApiService } from '@/app/services/apiService';
import { Box, Button, Stack } from '@mui/material';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';

interface Pod {
  name: string;
  [key: string]: unknown;
}

interface PodEntry {
  name: 'canary' | 'normal';
  created_at: number;
}

interface ChartData {
  name: string;
  series: { name: Date; value: number }[];
}

interface ApiResponse {
  status: string;
  pods: Pod[];
}

const DistributionChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showCanary, setShowCanary] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const distributionDataRef = useRef<PodEntry[]>([]);
  const apiService = new ApiService();

  const fetchData = async (): Promise<PodEntry[]> => {
    try {
      const response = await apiService.getPods('backend-deployment') as ApiResponse;
      console.log(`Fetched pod data:`, response);
      if (response.status === 'success') {
        const currentTime = Math.floor(Date.now() / 1000);
        const podEntries = response.pods.map((pod: Pod) => ({
          name: pod.name.includes('canary') ? 'canary' : 'normal',
          created_at: currentTime
        } as PodEntry));
        return podEntries;
      }
      return [];
    } catch (error) {
      console.error('Error fetching pod data:', error);
      return [];
    }
  };

  const groupDataByTime = (data: PodEntry[]): { [key: string]: { [key: number]: number } } => {
    const groupedData: { [key: string]: { [key: number]: number } } = {};
    data.forEach((entry) => {
      if (!entry || !entry.name || !entry.created_at) {
        console.warn('Invalid entry:', entry);
        return;
      }
      const timestamp = Math.floor(entry.created_at / 5) * 5;
      if (!groupedData[entry.name]) {
        groupedData[entry.name] = {};
      }
      if (!groupedData[entry.name][timestamp]) {
        groupedData[entry.name][timestamp] = 0;
      }
      groupedData[entry.name][timestamp]++;
    });
    console.log('Grouped data:', groupedData);
    return groupedData;
  };

  const transformDataForChart = (groupedData: { [key: string]: { [key: number]: number } }): ChartData[] => {
    const transformedData: ChartData[] = [];
    const allTimestamps = new Set<number>();

    for (const name in groupedData) {
      Object.keys(groupedData[name]).forEach(ts => allTimestamps.add(parseInt(ts)));
    }

    const timestamps = Array.from(allTimestamps).sort();

    const names = Object.keys(groupedData);
    names.forEach(name => {
      const seriesData = timestamps.map(timestamp => ({
        name: new Date(timestamp * 1000),
        value: groupedData[name][timestamp] || 0,
      }));
      transformedData.push({ name, series: seriesData });
    });

    console.log('Transformed data:', transformedData);
    return transformedData;
  };

  const refreshDistribution = (data: PodEntry[]) => {
    const groupedData = groupDataByTime(data);
    const transformedData = transformDataForChart(groupedData);
    setChartData(transformedData);

    setShowCanary(true);
    setTimeout(() => setShowCanary(false), 2000);
    setTimeout(() => setShowCanary(true), 4000);
  };

  const toggleCollection = () => {
    if (!isRunning) {
      setIsRunning(true);
      const interval = 5000;
      distributionDataRef.current = [];

      const apiCall = async () => {
        const podEntries = await fetchData();
        if (podEntries.length > 0) {
          distributionDataRef.current.push(...podEntries);
          console.log('Current distribution data:', distributionDataRef.current);
          refreshDistribution(distributionDataRef.current);
        }
      };

      apiCall();
      intervalRef.current = setInterval(apiCall, interval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsRunning(false);
      }
    }
  };

  const resetChart = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    setChartData([]);
    distributionDataRef.current = [];
    setShowCanary(true);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Collect all timestamps from all series
  const allTimestamps = new Set<number>();
  chartData.forEach(item => {
    item.series.forEach(point => {
      allTimestamps.add(point.name.getTime());
    });
  });
  const uniqueXAxisData = Array.from(allTimestamps)
    .sort((a, b) => a - b)
    .map(time => new Date(time));

  // Define the series data
  const series = chartData.map(item => {
    const dataMap = new Map(item.series.map(point => [point.name.getTime(), point.value]));
    const seriesData = uniqueXAxisData.map(date => dataMap.get(date.getTime()) || 0);
    return {
      label: item.name,
      data: seriesData,
      curve: 'linear' as const,
      color: item.name === 'canary' ? '#FF7F50' : '#9370DB',
      showMark: false,
      area: false,
      ...(item.name === 'canary' && { visible: showCanary })
    };
  });

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, margin: '0 auto', p: 2 }}>
      <Stack direction='row' spacing={2} sx={{ mb: 2 }}>
        <Button
          variant='contained'
          startIcon={<ArrowCircleLeftOutlinedIcon />}
          sx={{
            bgcolor: '#00C4B4',
            color: 'white',
            borderRadius: '8px',
            fontWeight: 'bold',
            '&:hover': { bgcolor: '#00b3a4' },
          }}
          href='/'
        >
          Back
        </Button>
        <Button
          variant='contained'
          startIcon={isRunning ? <StopCircleOutlinedIcon /> : <PlayCircleOutlineOutlinedIcon />}
          sx={{
            bgcolor: '#00C4B4',
            color: 'white',
            borderRadius: '8px',
            fontWeight: 'bold',
            '&:hover': { bgcolor: '#00b3a4' },
          }}
          onClick={toggleCollection}
          color={isRunning ? 'secondary' : 'primary'}
        >
          {isRunning ? 'Stop' : 'Start'}
        </Button>
        <Button
          variant='contained'
          startIcon={<RestartAltOutlinedIcon />}
          onClick={resetChart}
          color='error'
        >
          Reset
        </Button>
      </Stack>

      {chartData.length > 0 && (
        <Box sx={{ height: 500, width: '100%' }}>
          <LineChart
            xAxis={[{
              data: uniqueXAxisData,
              scaleType: 'time',
              valueFormatter: (date: Date) => date.toLocaleTimeString(),
            }]}
            series={series}
            height={500}
            grid={{ vertical: true, horizontal: true }}
            margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
            sx={{
              '& .MuiLineElement-root': {
                strokeWidth: 2,
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default DistributionChart;
