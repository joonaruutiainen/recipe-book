import React from 'react';
import { Outlet } from 'react-router-dom';
import { Footer, NavBar } from './components';
import './App.css';

const App = () => (
  <div className='App'>
    <NavBar />
    <Outlet />
    <Footer />
  </div>
);

export default App;
