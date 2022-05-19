import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, CircularProgress, Grid, TextField, Typography, Card, Box } from '@mui/material';
import RegistrationImg from '../img/registration.png';
import { Notification } from '../components';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { authActions } from '../redux/slices/authSlice';

const Register = () => {
  const { newUser, registrationData, loading, error } = useAppSelector(state => state.auth);

  const [name, setName] = useState<string>('');
  const [missingName, setMissingName] = useState<boolean>(false);
  const nameInput = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState<string>('');
  const [missingEmail, setMissingEmail] = useState<boolean>(false);
  const emailInput = useRef<HTMLInputElement>(null);

  const [password, setPassword] = useState<string>('');
  const [missingPassword, setMissingPassword] = useState<boolean>(false);
  const passwordInput = useRef<HTMLInputElement>(null);

  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [missingCorfimPassword, setMissingConfirmPassword] = useState<boolean>(false);
  const confirmPasswordInput = useRef<HTMLInputElement>(null);

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

  // navigate to login after successful registration
  useEffect(() => {
    if (newUser) navigate('/login');
  }, [dispatch, newUser]);

  useEffect(() => {
    if (registrationData) {
      setName(registrationData.name);
      setEmail(registrationData.email);
      setPassword(registrationData.password);
      setConfirmPassword(registrationData.confirmPassword);
      dispatch(authActions.clearRegistrationData());
    }
  }, [dispatch, registrationData]);

  const submit = (e?: React.FormEvent): void => {
    e?.preventDefault();
    if (!name) setMissingName(true);
    if (!email) setMissingEmail(true);
    if (!password) setMissingPassword(true);
    if (!confirmPassword) setMissingConfirmPassword(true);
    if (name && email && password && confirmPassword)
      dispatch(authActions.registerUser({ name, email, password, confirmPassword }));
  };

  return loading ? (
    <CircularProgress color='secondary' />
  ) : (
    <Grid container spacing={5}>
      <Grid container item md={5} direction='column' justifyContent='center' alignItems='center'>
        <img
          src={RegistrationImg}
          alt=''
          width={350}
          style={{ filter: 'drop-shadow(2px 2px 7px rgba(57, 53, 44, 0.4))' }}
        />
      </Grid>
      <Grid container item md={3} direction='column' justifyContent='center' alignItems='center'>
        <Card sx={{ width: '500px', height: '700px', justifyContent: 'space-evenly' }}>
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
            {(missingName || missingEmail || missingPassword || missingCorfimPassword) && (
              <Notification
                message='Täytä kaikki kentät'
                color='red'
                onClose={() => {
                  setMissingName(false);
                  setMissingEmail(false);
                  setMissingPassword(false);
                  setMissingConfirmPassword(false);
                }}
              />
            )}
          </Box>
          <form
            onSubmit={submit}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '300px' }}
          >
            <TextField
              label='Käyttäjätunnus'
              value={name}
              inputRef={nameInput}
              error={missingName}
              fullWidth
              autoFocus
              onChange={e => {
                if (missingName) setMissingName(false);
                setName(e.target.value);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  emailInput.current?.focus();
                }
              }}
            />
            <TextField
              label='Sähköposti'
              value={email}
              inputRef={emailInput}
              error={missingEmail}
              fullWidth
              onChange={e => {
                if (missingEmail) setMissingEmail(false);
                setEmail(e.target.value);
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
                  confirmPasswordInput.current?.focus();
                }
              }}
            />
            <TextField
              label='Vahvista salasana'
              type='password'
              value={confirmPassword}
              inputRef={confirmPasswordInput}
              error={missingCorfimPassword}
              fullWidth
              onChange={e => {
                if (missingCorfimPassword) setMissingConfirmPassword(false);
                setConfirmPassword(e.target.value);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  submit();
                }
              }}
            />
            <Button variant='contained' color='secondary' type='submit' sx={{ width: '220px' }}>
              Luo käyttäjä
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
            <Typography variant='body1'>Onko sinulla jo käyttäjätunnus?</Typography>
            <Button color='secondary' onClick={() => navigate('/login')}>
              Kirjaudu sisään
            </Button>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Register;
