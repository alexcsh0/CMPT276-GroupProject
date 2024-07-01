import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ErrorPage } from './components/pages/error/error';
import { Login } from './components/pages/login/login';
import { UserProvider } from './components/common/user-context/user-context';
import { Register } from './components/pages/login/register';
import { Dashboard } from './components/pages/dashboard/dashboard';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Define the routes for the application and components to display
const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
    errorElement: <ErrorPage />
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <ErrorPage />
  },
  {
    path: '/register',
    element: <Register />,
    errorElement: <ErrorPage />
  }
]);

// Render the application with routes
root.render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
