import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { userActions } from '../redux/slices/usersSlice';

const Users = () => {
  const users = useAppSelector(state => state.users.all);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (users.length === 0) dispatch(userActions.getUsers());
  }, [dispatch, users]);

  return (
    <div>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <div>ID: {user.id}</div>
            <div>Name: {user.name}</div>
            <div>Email: {user.email}</div>
            <div>Admin: {user.admin ? 'true' : 'false'}</div>
            <button
              type='button'
              onClick={() => {
                dispatch(userActions.selectUser(user.id));
                navigate(user.id);
              }}
            >
              Open profile
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Users;
