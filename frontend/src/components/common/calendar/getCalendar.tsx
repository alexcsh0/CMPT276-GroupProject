import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { Container, Typography, Box } from '@mui/material';
import { useUser } from '../user-context/user-context';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import {
  getApiUrl,
  getHandleChange
} from '../../../util/util';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../common/snackbar/snackbarContext';

const PublicCalendar: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
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
        setError('Error adding event');
      }
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={[
          { title: 'event 1', date: '2024-07-01' },
          { title: 'event 2', start: '2024-07-02', end: '2024-07-03' },
          { title: 'event 3', start: '2024-07-05', end: '2024-07-08' },
        ]}
      />

      <form onSubmit = {handleAddEvent} style = {{marginTop: 20, display: 'flex', justifyContent: 'center'}}>
        <input
          type = "text"
          name = "title"
          value = {title}
          onChange = {getHandleChange(setTitle)}
          placeholder = "Event Title"
          required
        />
        <input
          type = "date"
          name = "start"
          value = {start}
          onChange = {getHandleChange(setStart)}
          required
        />
        <input
          type = "date"
          name = "end"
          value = {end}
          onChange = {getHandleChange(setEnd)}
          required
        />
        <button type = "submit">Add Event</button>
      </form>
    </div>
  );
}

export default PublicCalendar;

