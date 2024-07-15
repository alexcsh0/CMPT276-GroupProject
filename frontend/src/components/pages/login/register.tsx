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

/**
 * Page for user registering
 * @returns Register react component
 */
export function Register() {
  const user = useUser();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    if (user.user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleRegister = async () => {
    setSubmitAttempted(true);

    if (!username || !password || !confirmedPassword) {
      setError('All fields must be completed');
      return;
    }

    if (password !== confirmedPassword) {
      setError('Passwords do not match');
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      await axios.post(`${getApiUrl()}/api/users/register`, {
        username,
        password,
        userType: isAdmin ? 1 : 0
      }).then((response) => {
        try {
          const { token, userType } = response.data;
          user.login(token, userType, true);
          navigate('/');
        } catch (error) {
          setError('Invalid username or password');
        }
      });
    } catch (error) {
      setError(
        'Sorry, there is an issue connecting to the server at the moment. Please try again later'
      );
    } finally {
      setLoading(false);
    }
  }

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
        Create an account
      </Typography>

      <TextField
        label="Username"
        value={username}
        onChange={getHandleChange(setUsername)}
        fullWidth
        required
        error={submitAttempted && !username}
        helperText={submitAttempted && !username ? "Username is required" : ""}
        disabled={loading}
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={getHandleChange(setPassword)}
        fullWidth
        required
        error={submitAttempted && !password}
        helperText={submitAttempted && !password ? "Password is required" : ""}
        sx={{ mt: 2 }}
        disabled={loading}
      />
      <TextField
        label="Confirm Password"
        type="password"
        value={confirmedPassword}
        onChange={(e) => {
          setConfirmedPassword(e.target.value);
          if (password !== e.target.value) {
            setError('Passwords do not match');
          } else {
            setError('');
          }
        }}
        fullWidth
        required
        error={!!confirmedPassword && password !== confirmedPassword}
        helperText={confirmedPassword && password !== confirmedPassword ? "Passwords do not match" : ""}
        sx={{ mt: 2 }}
        disabled={loading}
      />
      <FormControlLabel
        label="Sign up as Admin"
        control={
          <Checkbox
            color="primary"
            value={isAdmin}
            checked={isAdmin}
            onChange={getCheckboxChange(setIsAdmin)}
          />
        }
        sx={{ mt: 1, textAlign: 'left' }}
      />

      <Button
        onClick={handleRegister}
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        disabled={loading || !username || !password || !confirmedPassword || password !== confirmedPassword}
      >
        {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Register'}
      </Button>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Link href="/login" variant="body2">
          Already have an account? Sign in
        </Link>
      </Box>
    </Box>
  );
}
