import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ErrorPage } from './components/pages/error/error';
import { Dashboard } from './components/pages/dashboard/dashboard';
import { GetRoutes } from './components/pages/routes/routes';
import { Login } from './components/pages/login/login';
import { UserProvider } from './components/common/user-context/user-context';
import { Register } from './components/pages/login/register';
import { ThemeProvider, createTheme } from '@mui/material';
import { Logout } from './components/pages/login/logout';
import { GetWeather } from './components/pages/weather/weather';
import { GetCalendar } from './components/pages/calendar/calendar';
import { SnackbarProvider } from './components/common/snackbar/snackbarContext';
import { AlertForm } from './components/pages/alerts/alertsForm';

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
    path: '/register',
    element: <Register />,
    errorElement: <ErrorPage />
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <ErrorPage />
  },
  {
    path: '/logout',
    element: <Logout />,
    errorElement: <ErrorPage />
  },
  {
    path: '/routes',
    element: <GetRoutes />,
    errorElement: <ErrorPage />
  },
  {
    path: '/weather',
    element: <GetWeather />,
    errorElement: <ErrorPage />
  },
  {
    path: '/alerts',
    element: <AlertForm />,
    errorElement: <ErrorPage />
  },
  {
    path: '/calendar',
    element: <GetCalendar />,
    errorElement: <ErrorPage />
  }
]);

export const theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(0, 124, 173)',
      contrastText: 'rgb(255, 255, 255)'
    },
    secondary: {
      main: 'rgb(255, 255, 255)',
      contrastText: 'rgb(0, 0, 0)'
    }
  }
})

// Render the application with routes
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <UserProvider>
        <SnackbarProvider>
          <RouterProvider router={router} />
        </SnackbarProvider>
      </UserProvider>
    </ThemeProvider>
  </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
