import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CardContainer, Notification } from '../components';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { authActions } from '../redux/slices/authSlice';

const Login = () => {
  const { user, newUser, error } = useAppSelector(state => state.auth);

  const [identifier, setIdentifier] = useState<string>('');
  const [missingIdentifier, setMissingIdentifier] = useState<boolean>(false);
  const identifierInput = useRef<HTMLInputElement>(null);

  const [password, setPassword] = useState<string>('');
  const [missingPassword, setMissingPassword] = useState<boolean>(false);
  const passwordInput = useRef<HTMLInputElement>(null);

  const [notification, setNotification] = useState<React.ReactNode | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    identifierInput.current?.focus();
  }, []);

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

  const submit = (e?: React.FormEvent): void => {
    e?.preventDefault();
    if (!identifier) setMissingIdentifier(true);
    if (!password) setMissingPassword(true);
    if (identifier && password) dispatch(authActions.loginUser({ identifier, password }));
  };

  return (
    <CardContainer width='500px' height='550px'>
      <div
        style={{
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
      </div>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type='text'
          placeholder='Sähköposti / käyttäjätunnus'
          value={identifier}
          ref={identifierInput}
          style={missingIdentifier ? { borderColor: 'red' } : {}}
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
        <input
          type='password'
          placeholder='Salasana'
          value={password}
          ref={passwordInput}
          style={missingPassword ? { borderColor: 'red' } : {}}
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
        <button type='submit'>Kirjaudu sisään</button>
      </form>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100px',
        }}
      >
        <div>Oletko uusi käyttäjä?</div>
        <Link to='/register'>Rekisteröidy</Link>
      </div>
    </CardContainer>
  );
};

export default Login;
