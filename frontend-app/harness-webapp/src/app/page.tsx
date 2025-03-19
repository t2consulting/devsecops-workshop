// src/app/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Container, Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { ApiService } from '@/app/services/apiService';
import { HarnessFfService } from '@/app/services/harnessFFService';

export default function Home() {
  const [serviceName] = useState('backend');
  const [applicationVersion, setApplicationVersion] = useState('v1.4');
  const [lastExecution, setLastExecution] = useState('12.3');
  const [isCanary, setIsCanary] = useState(false);

  const apiService = new ApiService();
  const ffService = process.env.NEXT_PUBLIC_ENABLE_FF_SERVICE === 'true'
    ? new HarnessFfService()
    : null;

  useEffect(() => {
    refreshExecutionDetails();
  }, []); // Empty dependency array is fine since this only runs on mount

  const refreshExecutionDetails = async () => {
    const data = await apiService.getExecutionDetails();
    setApplicationVersion(data.application_version);
    setLastExecution(data.last_execution_id);
    setIsCanary(data.deployment_type === 'canary');
  };

  const checkValue = () => {
    if (!ffService) return false;
    return ffService.variationFF() === 'on';
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={10} justifyContent='center'>
        <Grid size={5}>
          <Card
            sx={{
              background: isCanary ? 'url(/assets/canary.png) center/contain' : 'linear-gradient(to bottom, #000, rgba(0, 34, 128, 0.598) 50%, #000)',
              backgroundRepeat: 'no-repeat',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
              position: 'relative',
              height: '700px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: '2px solid white',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant='h4' color='white' sx={{ fontWeight: 'bold' }}>
                  Application Details
                </Typography>
              </Box>
              <Typography variant='h5' color='white' sx={{ mt: 2 }}>
                {serviceName}
              </Typography>

              {checkValue() ? (
                <>
                  <Typography variant='h4' color='white' sx={{ mt: 4 }}>
                    Events
                  </Typography>
                  <Typography color='white' sx={{ mt: 2 }}>
                    Discover DevOps innovations with Harness at worldwide events, reshaping the future of modern software delivery.
                  </Typography>
                </>
              ) : (
                <>
                  <Card
                    sx={{
                      mt: 4,
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      p: 2,
                      textAlign: 'center',
                      border: '2px solid white',
                    }}
                  >
                    <Typography variant='h6' color='white' sx={{ fontWeight: 'bold' }}>
                      Version
                    </Typography>
                    <Typography variant='body1' color='white'>
                      {applicationVersion}
                    </Typography>
                  </Card>
                  <Card
                    sx={{
                      mt: 2,
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      p: 2,
                      textAlign: 'center',
                      border: '2px solid white',
                    }}
                  >
                    <Typography variant='h6' color='white' sx={{ fontWeight: 'bold' }}>
                      Last Execution
                    </Typography>
                    <Typography variant='body1' color='white'>
                      {lastExecution}
                    </Typography>
                  </Card>
                </>
              )}
            </CardContent>
            <Box sx={{ p: 2 }}>
              <Button
                variant='contained'
                sx={{
                  bgcolor: '#00C4B4',
                  color: 'white',
                  width: '100%',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  '&:hover': { bgcolor: '#00b3a4' },
                }}
                onClick={checkValue() ? undefined : refreshExecutionDetails}
                href={checkValue() ? 'https://www.harness.io/events' : undefined}
              >
                {checkValue() ? 'Learn More' : 'Check Release'}
              </Button>
            </Box>
          </Card>
        </Grid>

        <Grid size={5}>
          <Card
            sx={{
              background: 'black',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
              position: 'relative',
              height: '700px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: '2px solid white',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant='h4' color='white' sx={{ fontWeight: 'bold' }}>
                  Distribution Test
                </Typography>
              </Box>
              <Typography variant='h5' color='white' sx={{ mt: 2 }}>
                Synthetic Test
              </Typography>
            </CardContent>
            <CardMedia
              component='img'
              image='/assets/distribution.png'
              alt='Distribution'
              sx={{
                height: '100%',
                objectFit: 'contain',
                padding: '16px',
              }}
            />
            <Box sx={{ p: 2 }}>
              <Button
                variant='contained'
                sx={{
                  bgcolor: '#00C4B4',
                  color: 'white',
                  width: '100%',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  '&:hover': { bgcolor: '#00b3a4' },
                }}
                href='/distribution'
              >
                Start
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
