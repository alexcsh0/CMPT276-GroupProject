import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  getApiUrl,
  getHandleChange,
  getCheckboxChange
} from '../../../util/util';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Link,
  TextField,
  Typography
} from '@mui/material';
import { useUser } from '../../common/user-context/user-context';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../common/snackbar/snackbarContext';

/**
 * Page for user login
 * @returns Login react component
 */
export function Login() {
  const user = useUser();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user.user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axios.post(`${getApiUrl()}/api/users/login`, {
        username,
        password
      });
      const { token, userType } = response.data;
      user.login(token, userType, rememberMe);
      showSnackbar('Logged in as ' + username);
      navigate('/');
    } catch (error) {
      if ((error as any).response && (error as any).response.status === 401) {
        setError('Incorrect username or password. Please try again.');
      } else {
        setError('Sorry, there is an issue connecting to the server at the moment. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: '500px',
        margin: 'auto',
        marginTop: '8vh',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        backgroundColor: 'white',
      }}
    >
      <Typography variant="h5" component="div" sx={{ mb: 2 }}>
        Sign In
      </Typography>

      {error && (
        <Typography variant="body2" sx={{ color: 'red', mb: 2, fontSize: 16 }}>
          {error}
        </Typography>
      )}

      <TextField
        label="Username"
        value={username}
        onChange={getHandleChange(setUsername)}
        fullWidth
        required
        disabled={loading}
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={getHandleChange(setPassword)}
        fullWidth
        required
        sx={{ mt: 2 }}
        disabled={loading}
      />
      <FormControlLabel
        label="Remember Me"
        control={
          <Checkbox
            color="primary"
            value={rememberMe}
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
        }
        sx={{ mt: 1, textAlign: 'left' }}
      />

      <Button
        onClick={handleLogin}
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        disabled={loading || !username || !password}
      >
        {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Login'}
      </Button>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Link href="/register" variant="body2">
          Don't have an account? Sign Up
        </Link>
      </Box>
    </Box>
  );
}
