import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CircularProgress, Stack, Typography, Box, TextField, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import KeyIcon from '@mui/icons-material/Key';
import { CardContainer, Notification } from '../components';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { userActions } from '../redux/slices/usersSlice';
import { authActions } from '../redux/slices/authSlice';

const User = () => {
  const { selected: user, userUpdated, loading, error } = useAppSelector(state => state.users);

  const [editingUser, setEditingUser] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  const [name, setName] = useState<string>('');
  const [missingName, setMissingName] = useState<boolean>(false);

  const [email, setEmail] = useState<string>('');
  const [missingEmail, setMissingEmail] = useState<boolean>(false);

  const [password, setPassword] = useState<string>('');
  const [missingPassword, setMissingPassword] = useState(false);

  const [newPassword, setNewPassword] = useState<string>('');
  const [missingNewPassword, setMissingNewPassword] = useState(false);

  const [notification, setNotification] = useState<React.ReactNode | null>(null);

  const dispatch = useAppDispatch();
  const { userId } = useParams();

  useEffect(() => {
    if (!user && userId) dispatch(userActions.getUser(userId));
  }, [dispatch, user]);

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
      dispatch(userActions.clearError());
    }
  }, [error]);

  useEffect(() => {
    if (userUpdated && user) {
      if (editingUser) {
        setEditingUser(false);
        setNotification(
          <Notification
            message='Käyttäjätiedot päivitetty'
            color='green'
            onClose={() => {
              setNotification(null);
            }}
          />
        );
      }
      if (changePassword) {
        setChangePassword(false);
        setPassword('');
        setNewPassword('');
        setNotification(
          <Notification
            message='Salasana vaihdettu'
            color='green'
            onClose={() => {
              setNotification(null);
            }}
          />
        );
      }
      dispatch(userActions.clearUserUpdated());
      dispatch(authActions.updateCurrentUser(user));
    }
  }, [dispatch, userUpdated, user]);

  const submitUpdate = () => {
    if (notification) setNotification(null);
    if (!name) setMissingName(true);
    if (!email) setMissingEmail(true);
    if (name === user?.name && email === user?.email) setEditingUser(false);
    if (user && name && email && (name !== user.name || email !== user.email))
      dispatch(
        userActions.updateUser({
          id: user.id,
          name: name !== user.name ? name : undefined,
          email: email !== user.email ? email : undefined,
        })
      );
  };

  const submitChangePassword = () => {
    if (notification) setNotification(null);
    if (!password) setMissingPassword(true);
    if (!newPassword) setMissingNewPassword(true);
    if (user && password && newPassword)
      dispatch(
        userActions.updateUser({
          id: user.id,
          password,
          newPassword,
        })
      );
  };

  return loading ? (
    <CardContainer width='500px' height='550px'>
      <CircularProgress color='secondary' />
    </CardContainer>
  ) : (
    <CardContainer width='500px' height='550px'>
      {user && (
        <Stack direction='column' justifyContent='space-between' spacing={2} width='90%' height='90%'>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '130px',
            }}
          >
            {notification}
          </Box>
          {!editingUser && (
            <Stack direction='column' justifyContent='center' alignItems='flex-end' spacing={2} width='100%'>
              <Stack direction='row' justifyContent='flex-end' spacing={5} width='100%'>
                <Box sx={{ width: '40%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <Typography variant='body1' color='secondary'>
                    Käyttäjätunnus:
                  </Typography>
                </Box>
                <Typography variant='body1' sx={{ width: '50%' }}>
                  {user.name}
                </Typography>
              </Stack>
              <Stack direction='row' justifyContent='flex-end' spacing={5} width='100%'>
                <Box sx={{ width: '40%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <Typography variant='body1' color='secondary'>
                    Sähköposti:
                  </Typography>
                </Box>
                <Typography variant='body1' sx={{ width: '50%' }}>
                  {user.email}
                </Typography>
              </Stack>
              <Button
                endIcon={<EditIcon color='primary' />}
                size='small'
                onClick={() => {
                  setName(user.name);
                  setEmail(user.email);
                  if (changePassword) setChangePassword(false);
                  setEditingUser(true);
                }}
                sx={{
                  fontSize: 20,
                  paddingX: 3,
                  textTransform: 'none',
                  borderRadius: 25,
                }}
              >
                Muokkaa
              </Button>
            </Stack>
          )}
          {editingUser && (
            <Stack direction='column' justifyContent='center' spacing={2} width='100%'>
              <TextField
                label='Käyttäjätunnus'
                value={name}
                error={missingName}
                fullWidth
                color='secondary'
                onChange={e => {
                  if (missingName) setMissingName(false);
                  setName(e.target.value);
                }}
              />
              <TextField
                label='Sähköposti'
                value={email}
                error={missingEmail}
                fullWidth
                color='secondary'
                onChange={e => {
                  if (missingEmail) setMissingEmail(false);
                  setEmail(e.target.value);
                }}
              />
              <Stack direction='row' spacing={2} justifyContent='flex-end' alignItems='center' width='100%'>
                <Button
                  endIcon={<CloseIcon color='primary' />}
                  size='small'
                  onClick={() => setEditingUser(false)}
                  sx={{
                    fontSize: 20,
                    paddingX: 3,
                    textTransform: 'none',
                    borderRadius: 25,
                  }}
                >
                  Peruuta
                </Button>
                <Button
                  endIcon={<DoneIcon color='primary' />}
                  size='small'
                  onClick={submitUpdate}
                  sx={{
                    fontSize: 20,
                    paddingX: 3,
                    textTransform: 'none',
                    borderRadius: 25,
                  }}
                >
                  Tallenna
                </Button>
              </Stack>
            </Stack>
          )}
          {!changePassword && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '200px',
              }}
            >
              <Button
                startIcon={<KeyIcon color='primary' />}
                onClick={() => {
                  if (editingUser) setEditingUser(false);
                  setChangePassword(true);
                }}
                sx={{
                  fontSize: 20,
                  paddingX: 3,
                  textTransform: 'none',
                  borderRadius: 25,
                }}
              >
                Vaihda salasana
              </Button>
            </Box>
          )}
          {changePassword && (
            <Stack direction='column' alignItems='center' spacing={2} width='100%' height='200px'>
              <TextField
                label='Vanha salasana'
                type='password'
                value={password}
                error={missingPassword}
                fullWidth
                autoFocus
                color='secondary'
                onChange={e => setPassword(e.target.value)}
              />
              <TextField
                label='Uusi salasana'
                type='password'
                value={newPassword}
                error={missingNewPassword}
                fullWidth
                color='secondary'
                onChange={e => setNewPassword(e.target.value)}
              />
              <Stack direction='row' spacing={2} justifyContent='flex-end' alignItems='center' width='100%'>
                <Button
                  endIcon={<CloseIcon color='primary' />}
                  size='small'
                  onClick={() => setChangePassword(false)}
                  sx={{
                    fontSize: 20,
                    paddingX: 3,
                    textTransform: 'none',
                    borderRadius: 25,
                  }}
                >
                  Peruuta
                </Button>
                <Button
                  endIcon={<DoneIcon color='primary' />}
                  size='small'
                  onClick={submitChangePassword}
                  sx={{
                    fontSize: 20,
                    paddingX: 3,
                    textTransform: 'none',
                    borderRadius: 25,
                  }}
                >
                  Tallenna
                </Button>
              </Stack>
            </Stack>
          )}
        </Stack>
      )}
    </CardContainer>
  );
};
export default User;
