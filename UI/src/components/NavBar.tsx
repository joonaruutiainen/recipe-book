import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Box, Toolbar, Typography, IconButton, Menu, MenuItem, Button, Tooltip } from '@mui/material';
import Logo from '../img/logo.png';
import UserIcon from '../img/user.png';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { authActions } from '../redux/slices/authSlice';
import { userActions } from '../redux/slices/usersSlice';

const NavBar = () => {
  const { user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const openUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const closeUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position='static' sx={{ width: '100vw' }}>
      <Toolbar disableGutters>
        <Box
          sx={{ ml: 5, display: 'flex', justifyContent: 'center', '&:hover': { cursor: 'pointer' } }}
          onClick={() => navigate('/')}
        >
          <img src={Logo} alt='' height='80px' />
        </Box>
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          <Button onClick={() => navigate('/')} sx={{ my: 2, color: 'white', textTransform: 'none', display: 'block' }}>
            Home
          </Button>
          <Button
            onClick={() => navigate('login')}
            sx={{ my: 2, color: 'white', textTransform: 'none', display: 'block' }}
          >
            Login
          </Button>
          <Button
            onClick={() => navigate('register')}
            sx={{ my: 2, color: 'white', textTransform: 'none', display: 'block' }}
          >
            Register
          </Button>
          <Button
            onClick={() => navigate('recipes')}
            sx={{ my: 2, color: 'white', textTransform: 'none', display: 'block' }}
          >
            Recipes
          </Button>
          <Button
            onClick={() => navigate('recipeEditor')}
            sx={{ my: 2, color: 'white', textTransform: 'none', display: 'block' }}
          >
            RecipeEditor
          </Button>
          <Button
            onClick={() => navigate('users')}
            sx={{ my: 2, color: 'white', textTransform: 'none', display: 'block' }}
          >
            Users
          </Button>
        </Box>
        {user && (
          <Box
            sx={{
              width: 'max-content',
              mr: 5,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Tooltip title='Open user settings' enterDelay={1000}>
              <IconButton onClick={openUserMenu} sx={{ p: 0 }}>
                <img
                  src={UserIcon}
                  alt=''
                  width={65}
                  style={{ filter: 'drop-shadow(3px 3px 7px rgba(57, 53, 44, 0.8))' }}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '64px', textAlign: 'center' }}
              id='menu-appbar'
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              open={Boolean(anchorElUser)}
              onClose={closeUserMenu}
            >
              <Typography variant='h6' color='secondary' minWidth={100}>
                {user.name}
              </Typography>
              <MenuItem
                onClick={() => {
                  dispatch(userActions.selectUser(user.id));
                  navigate(`/users/${user.id}`);
                  closeUserMenu();
                }}
                sx={{ justifyContent: 'center' }}
              >
                <Typography textAlign='center'>Asetukset</Typography>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  dispatch(authActions.logoutUser());
                  navigate('/');
                  closeUserMenu();
                }}
                sx={{ justifyContent: 'center' }}
              >
                <Typography textAlign='center'>Kirjaudu ulos</Typography>
              </MenuItem>
            </Menu>
          </Box>
        )}
        {!user && (
          <Button
            variant='contained'
            color='secondary'
            onClick={() => navigate('login')}
            sx={{
              width: '220px',
              mr: 5,
              fontSize: 20,
              paddingX: 3,
              textTransform: 'none',
              borderRadius: 25,
            }}
          >
            Kirjaudu sisään
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};
export default NavBar;
