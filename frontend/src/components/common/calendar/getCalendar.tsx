import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Typography, Box, CircularProgress, Button } from '@mui/material';
import { useUser } from '../user-context/user-context';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import {
  getApiUrl,
  getHandleChange
} from '../../../util/util';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../common/snackbar/snackbarContext';

interface Event {
  username: string;
  title: string;
  start: string;
  end: string;
}

const PublicCalendar: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [ userEvents, setUserEvents ] = useState<Event[]>([]);

  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [submitAttempted] = useState(false);
  let username: string | null = null;
  
  if (user) {
    username = user.username;
  } else {
    username = null;
  }

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddEvent = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (username == null) throw error;
      await axios.post(`${getApiUrl()}/api/calendar/add`, {
        username,
        title,
        start,
        end
      }, {
        headers: {
            'Authorization': `Bearer ${user?.token}`
        }
      }).then(() => {
        navigate('/calendar');
        showSnackbar('Event created successfully.');
      });
    } catch (error) {
      if (username == null) {
        setError('Please log in to add an event');
      } else {
        setError('Error adding user event');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        if (username == null) throw error;
        const response = await axios.get(`${getApiUrl()}/api/calendar/get`, {
          headers: {
            'Authorization': `Bearer ${user?.token}`
          }
        });
        setUserEvents(response.data);
      } catch (error) {
        if (username == null) {
          console.error("Please log in to view custom events");
        } else {
          console.error("Error fetching user events", error);
        }
      }
    };

    fetchUserEvents();
  },);

  const [alerts, setAlerts] = useState<Event[]>([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.post(`${getApiUrl()}/api/alerts/addEvent`, {
          headers: {
            'Authorization': `Bearer ${user?.token}`
          }
        });
        const alert = response.data;
        const alertEvent = {
          username: 'TransLink',
          title: alert.title,
          start: alert.startDate,
          end: alert.endDate,
        };

        setAlerts([alertEvent]);

        // const fetchedEvents = response.data.map((alert: Event) => ({
        //   username: 'TransLink',
        //   title: alert.title,
        //   start: alert.start,
        //   end: alert.end,
        // }));

        // setAlerts(fetchedEvents);
      } catch (error) {
        console.error('Error fetching translink alerts', error);
      }
    };

    fetchAlerts();
  }, [user?.token]);
  
  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={alerts}
      />

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
                Add an Event
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
            />
            <TextField
                label="Start date (YYYY-MM-DD)"
                value={start}
                onChange={getHandleChange(setStart)}
                fullWidth
                required
                error={submitAttempted && !start}
                helperText={submitAttempted && !start ? "Affected Service is required" : ""}
                sx={{ mt: 2 }}
                disabled={loading}
            />
            <TextField
                label="End date (YYYY-MM-DD)"
                value={end}
                onChange={getHandleChange(setEnd)}
                fullWidth
                required
                multiline
                rows={4}
                error={submitAttempted && !end}
                helperText={submitAttempted && !end ? "Message is required" : ""}
                sx={{ mt: 2 }}
                disabled={loading}
            />

            <Button
                onClick={handleAddEvent}
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                disabled={loading || !title || !start || !end}
            >
                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Create Event'}
            </Button>

            {error && (
                <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                    {error}
                </Typography>
            )}
        </Box>
    </div>
  );
}

export default PublicCalendar;

