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
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../common/snackbar/snackbarContext';

/**
 * Page for creating alerts
 * @returns AlertForm react component
 */
export function AlertForm() {
    const { user } = useUser();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const [title, setTitle] = useState('');
    const [affectedService, setAffectedService] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitAttempted, setSubmitAttempted] = useState(false);

    const handleCreateAlert = async () => {
        setSubmitAttempted(true);

        if (!title || !affectedService || !message) {
            setError('All fields must be completed');
            return;
        }

        if (loading) return;
        setLoading(true);

        try {
            await axios.post(`${getApiUrl()}/api/alerts`, {
                title,
                affectedService,
                message
            }, {
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                }
            }).then((response) => {
                setTitle('');
                setAffectedService('');
                setMessage('');
                setError('');
                navigate('/');
                showSnackbar('Alert created successfully.');
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
            data-testid="alert-form"
        >
            <Typography variant="h5" component="div" sx={{ mb: 2 }}>
                Create an Alert
            </Typography>

            <TextField
                label="Title"
                value={title}
                onChange={getHandleChange(setTitle)}
                fullWidth
                required
                error={submitAttempted && !title}
                helperText={submitAttempted && !title ? "Title is required" : ""}
                disabled={loading}
                inputProps={{ 'data-testid': 'alert-title-input' }}
            />
            <TextField
                label="Affected Service"
                value={affectedService}
                onChange={getHandleChange(setAffectedService)}
                fullWidth
                required
                error={submitAttempted && !affectedService}
                helperText={submitAttempted && !affectedService ? "Affected Service is required" : ""}
                sx={{ mt: 2 }}
                disabled={loading}
                inputProps={{ 'data-testid': 'alert-affected-service-input' }}
            />
            <TextField
                label="Message"
                value={message}
                onChange={getHandleChange(setMessage)}
                fullWidth
                required
                multiline
                rows={4}
                error={submitAttempted && !message}
                helperText={submitAttempted && !message ? "Message is required" : ""}
                sx={{ mt: 2 }}
                disabled={loading}
                inputProps={{ 'data-testid': 'alert-message-input' }}
            />

            <Button
                onClick={handleCreateAlert}
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                disabled={loading || !title || !affectedService || !message}
                data-testid="alert-submit-button"
            >
                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Create Alert'}
            </Button>

            {error && (
                <Typography color="error" variant="body2" sx={{ mt: 2 }} >
                    {error}
                </Typography>
            )}
        </Box>
    );
}
