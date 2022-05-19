import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Button, CircularProgress, TextField, Typography, Card, Box } from '@mui/material';
import LoginImg from '../img/login.png';
import { Notification } from '../components';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { authActions } from '../redux/slices/authSlice';

const Login = () => {
  const { user, newUser, loginData, loading, error } = useAppSelector(state => state.auth);

  const [identifier, setIdentifier] = useState<string>('');
  const [missingIdentifier, setMissingIdentifier] = useState<boolean>(false);
  const identifierInput = useRef<HTMLInputElement>(null);

  const [password, setPassword] = useState<string>('');
  const [missingPassword, setMissingPassword] = useState<boolean>(false);
  const passwordInput = useRef<HTMLInputElement>(null);

  const [notification, setNotification] = useState<React.ReactNode | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // catch error from store, make a notification and clear the error from store
  useEffect(() => {
    if (error) {
      setNotification(
        <Notification
          message={error.message}
          color='red'
          details={error.details}
          onClose={() => {
            setNotification(null);
          }}
        />
      );
      dispatch(authActions.clearError());
    }
  }, [error]);

  // navigate to home after successful login
  useEffect(() => {
    if (user) navigate('/');
  }, [dispatch, user]);

  // pre-set identifier input field if redirected to login after user registration
  useEffect(() => {
    if (newUser) {
      setNotification(
        <Notification
          message='Uusi käyttäjä luotu'
          color='green'
          onClose={() => {
            setNotification(null);
          }}
        />
      );
      setIdentifier(newUser.email);
      dispatch(authActions.clearNewUser());
    }
  }, [dispatch, newUser]);

  useEffect(() => {
    if (loginData) {
      setIdentifier(loginData.identifier);
      setPassword(loginData.password);
      dispatch(authActions.clearLoginData());
    }
  }, [dispatch, loginData]);

  const submit = (e?: React.FormEvent): void => {
    e?.preventDefault();
    if (!identifier) setMissingIdentifier(true);
    if (!password) setMissingPassword(true);
    if (identifier && password) dispatch(authActions.loginUser({ identifier, password }));
  };

  return loading ? (
    <CircularProgress color='secondary' />
  ) : (
    <Grid container spacing={5}>
      <Grid container item md={5} direction='column' justifyContent='center' alignItems='center'>
        <img src={LoginImg} alt='' width={300} style={{ filter: 'drop-shadow(2px 2px 7px rgba(57, 53, 44, 0.4))' }} />
      </Grid>
      <Grid container item md={3} direction='column' justifyContent='center' alignItems='center'>
        <Card sx={{ width: '500px', height: '550px', justifyContent: 'space-evenly' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100px',
            }}
          >
            {notification}
            {(missingIdentifier || missingPassword) && (
              <Notification
                message='Täytä kaikki kentät'
                color='red'
                onClose={() => {
                  setMissingIdentifier(false);
                  setMissingPassword(false);
                }}
              />
            )}
          </Box>
          <form
            onSubmit={submit}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '300px' }}
          >
            <TextField
              label='Sähköposti / käyttäjätunnus'
              value={identifier}
              inputRef={identifierInput}
              error={missingIdentifier}
              fullWidth
              autoFocus
              onChange={e => {
                if (missingIdentifier) setMissingIdentifier(false);
                setIdentifier(e.target.value);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  passwordInput.current?.focus();
                }
              }}
            />
            <TextField
              label='Salasana'
              type='password'
              value={password}
              inputRef={passwordInput}
              error={missingPassword}
              fullWidth
              onChange={e => {
                if (missingPassword) setMissingPassword(false);
                setPassword(e.target.value);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  submit();
                }
              }}
            />
            <Button variant='contained' color='secondary' type='submit' sx={{ width: '220px' }}>
              Kirjaudu sisään
            </Button>
          </form>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100px',
            }}
          >
            <Typography variant='body1'>Oletko uusi käyttäjä?</Typography>
            <Button color='secondary' onClick={() => navigate('/register')}>
              Rekisteröidy
            </Button>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Login;
