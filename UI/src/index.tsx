import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import App from './App';
import store from './redux/store';
import {
  AuthRoute,
  ProtectedRoute,
  LandingPage,
  Login,
  Register,
  Recipes,
  Recipe,
  RecipeEditor,
  Users,
  User,
} from './routes';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />}>
            <Route index element={<LandingPage />} />
            <Route path='login' element={<AuthRoute />}>
              <Route index element={<Login />} />
            </Route>
            <Route path='register' element={<AuthRoute />}>
              <Route index element={<Register />} />
            </Route>
            <Route path='recipes' element={<Recipes />} />
            <Route path='recipes/:recipeId' element={<Recipe />} />
            <Route path='recipeEditor' element={<ProtectedRoute />}>
              <Route index element={<RecipeEditor />} />
            </Route>
            <Route path='users' element={<ProtectedRoute adminRequired />}>
              <Route index element={<Users />} />
              <Route path=':userId' element={<User />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
