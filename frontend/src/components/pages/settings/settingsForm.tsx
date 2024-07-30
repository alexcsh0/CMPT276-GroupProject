import React, { useState } from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    CircularProgress,
    TextField,
    Typography
} from '@mui/material';
import { getApiUrl, getHandleChange } from '../../../util/util';
import { useUser } from '../../common/user-context/user-context';
import { useSnackbar } from '../../common/snackbar/snackbarContext';
import { useNavigate } from 'react-router-dom';

export function SettingsForm() {
    const { user } = useUser();
    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitAttempted, setSubmitAttempted] = useState(false);

    const handleChangePassword = async () => {
        setSubmitAttempted(true);
        setError('');

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            setError('All fields must be completed');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setError('New passwords do not match');
            return;
        }

        if (loading) return;
        setLoading(true);

        const token = user?.token.trim();
        console.log(token);

        try {

            let token = user?.token.trim();

            if (token?.endsWith('=')) {
                token.slice(0, -1);
            }

            await axios.put(`${getApiUrl()}/api/users/settings/change-password`, {
                oldPassword: currentPassword,
                newPassword: newPassword,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(() => {
                setCurrentPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
                setError('');
                navigate('/');
                showSnackbar('Password changed successfully.');
            });
        } catch (error) {
            setError('Invalid credentials or error processing request.');
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
                Change Password
            </Typography>

            <TextField
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={getHandleChange(setCurrentPassword)}
                fullWidth
                required
                error={submitAttempted && !currentPassword}
                helperText={submitAttempted && !currentPassword ? "Current password is required" : ""}
                disabled={loading}
                sx={{ mt: 2 }}
            />
            <TextField
                label="New Password"
                type="password"
                value={newPassword}
                onChange={getHandleChange(setNewPassword)}
                fullWidth
                required
                error={submitAttempted && !newPassword}
                helperText={submitAttempted && !newPassword ? "New password is required" : ""}
                disabled={loading}
                sx={{ mt: 2 }}
            />
            <TextField
                label="Confirm New Password"
                type="password"
                value={confirmNewPassword}
                onChange={getHandleChange(setConfirmNewPassword)}
                fullWidth
                required
                error={submitAttempted && newPassword !== confirmNewPassword}
                helperText={submitAttempted && newPassword !== confirmNewPassword ? "Passwords do not match" : ""}
                disabled={loading}
                sx={{ mt: 2 }}
            />

            <Button
                onClick={handleChangePassword}
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                disabled={loading || !currentPassword || !newPassword || !confirmNewPassword || newPassword !== confirmNewPassword}
            >
                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Change Password'}
            </Button>

            {error && (
                <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                    {error}
                </Typography>
            )}
        </Box>
    );
}
