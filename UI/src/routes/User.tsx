import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { userActions } from '../redux/slices/usersSlice';

const User = () => {
  const user = useAppSelector(state => state.users.selected);
  const dispatch = useAppDispatch();
  const { userId } = useParams();

  useEffect(() => {
    if (!user && userId) dispatch(userActions.getUser(userId));
  }, [user, dispatch]);

  return <div>{user && <div>{user.name}</div>}</div>;
};
export default User;
