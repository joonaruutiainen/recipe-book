import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CardContainer, Notification } from '../components';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { authActions } from '../redux/slices/authSlice';

const Register = () => {
  const { newUser, error } = useAppSelector(state => state.auth);

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

  useEffect(() => {
    nameInput.current?.focus();
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

  // navigate to login after successful registration
  useEffect(() => {
    if (newUser) navigate('/login');
  }, [dispatch, newUser]);

  const submit = (e?: React.FormEvent): void => {
    e?.preventDefault();
    if (!name) setMissingName(true);
    if (!email) setMissingEmail(true);
    if (!password) setMissingPassword(true);
    if (!confirmPassword) setMissingConfirmPassword(true);
    if (name && email && password && confirmPassword)
      dispatch(authActions.registerUser({ name, email, password, confirmPassword }));
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
      </div>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type='text'
          placeholder='Käyttäjätunnus'
          value={name}
          ref={nameInput}
          style={missingName ? { borderColor: 'red' } : {}}
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
        <input
          type='text'
          placeholder='Sähköposti'
          value={email}
          ref={emailInput}
          style={missingEmail ? { borderColor: 'red' } : {}}
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
              confirmPasswordInput.current?.focus();
            }
          }}
        />
        <input
          type='password'
          placeholder='Vahvista salasana'
          value={confirmPassword}
          ref={confirmPasswordInput}
          style={missingCorfimPassword ? { borderColor: 'red' } : {}}
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
        <button type='submit'>Luo käyttäjä</button>
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
        <div>Onko sinulla jo käyttäjätunnus?</div>
        <Link to='/login'>Kirjaudu sisään</Link>
      </div>
    </CardContainer>
  );
};

export default Register;
