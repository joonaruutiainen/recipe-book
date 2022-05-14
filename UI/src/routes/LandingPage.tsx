import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button, Stack, Typography, Box, Grid } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import MealIcon from '../img/meal.png';
import ChefIcon from '../img/chef.png';
import { useAppSelector } from '../redux/hooks';

const LandingPage = () => {
  const { user, loading } = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  return user && !loading ? (
    <Navigate to='recipes' />
  ) : (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <Grid container justifyContent='center' alignItems='center' spacing={15}>
        <Grid
          item
          container
          lg={5}
          direction='column'
          justifyContent='center'
          paddingY={10}
          sx={{
            alignItems: { xs: 'center', lg: 'flex-end' },
          }}
        >
          <Box
            sx={{
              width: 650,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <div style={{ width: '450px', height: '250px', backgroundColor: 'white' }} />
            <Stack direction='column' justifyContent='center' spacing={2}>
              <Stack direction='row' spacing={2} alignItems='center'>
                <DoneIcon color='secondary' />
                <Typography variant='h6'>Tallenna reseptejä valmiin pohjan avulla</Typography>
              </Stack>
              <Stack direction='row' spacing={2} alignItems='center'>
                <DoneIcon color='secondary' />
                <Typography variant='h6'>Luo oma reseptikokoelmasi</Typography>
              </Stack>
              <Stack direction='row' spacing={2} alignItems='center'>
                <DoneIcon color='secondary' />
                <Typography variant='h6'>Selaa muiden käyttäjien julkaisemia reseptejä</Typography>
              </Stack>
            </Stack>
          </Box>
        </Grid>
        <Grid
          item
          container
          lg={5}
          direction='column'
          justifyContent='center'
          paddingY={10}
          sx={{
            alignItems: { xs: 'center', lg: 'flex-end' },
          }}
        >
          <Box
            sx={{
              width: 650,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <Stack direction='row' justifyContent='space-between' alignItems='center' width='100%'>
              <img
                src={MealIcon}
                alt=''
                width={300}
                style={{ filter: 'drop-shadow(2px 2px 7px rgba(57, 53, 44, 0.4))' }}
              />
              <Stack direction='column' justifyContent='center' alignItems='center' spacing={3}>
                <Stack direction='column' justifyContent='center' alignItems='center'>
                  <Typography variant='h6'>Mitäs sitä tänään söisi?</Typography>
                  <Typography variant='h6'>Tutustu reseptikirjan valikoimaan!</Typography>
                </Stack>
                <Button
                  variant='contained'
                  color='secondary'
                  onClick={() => navigate('/recipes')}
                  size='small'
                  sx={{
                    width: '220px',
                    fontSize: 20,
                    paddingX: 3,
                    textTransform: 'none',
                    borderRadius: 25,
                  }}
                >
                  Selaa reseptejä
                </Button>
              </Stack>
            </Stack>
            <Stack direction='row' justifyContent='space-between' alignItems='center' width='100%'>
              <Box sx={{ width: 300, display: 'flex', justifyContent: 'center' }}>
                <img
                  src={ChefIcon}
                  alt=''
                  width={250}
                  style={{ filter: 'drop-shadow(2px 2px 7px rgba(57, 53, 44, 0.4))' }}
                />
              </Box>
              <Stack direction='column' justifyContent='center' alignItems='center' spacing={3}>
                <Stack direction='column' justifyContent='center' alignItems='center'>
                  <Typography variant='h6'>Lisää omia reseptejäsi ja aloita </Typography>
                  <Typography variant='h6'>kokoelmasi kasvattaminen!</Typography>
                </Stack>
                <Button
                  variant='contained'
                  color='secondary'
                  onClick={() => navigate('/register')}
                  size='small'
                  sx={{
                    width: '220px',
                    fontSize: 20,
                    paddingX: 3,
                    textTransform: 'none',
                    borderRadius: 25,
                  }}
                >
                  Luo uusi käyttäjä
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default LandingPage;
