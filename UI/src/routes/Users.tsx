import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { userActions } from '../redux/slices/usersSlice';

const Users = () => {
  const users = useAppSelector(state => state.users.all);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <div>
      {users.length === 0 && (
        <button type='button' onClick={() => dispatch(userActions.getUsers())}>
          Get users
        </button>
      )}
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <div>Name: {user.name}</div>
            <div>Email: {user.email}</div>
            <div>Admin: {user.admin}</div>
            <button
              type='button'
              onClick={() => {
                dispatch(userActions.getUser(user.id));
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
