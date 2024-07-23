import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { Container, Typography, Box } from '@mui/material';

const API_KEY = 'AIzaSyD5QwAHagdbf8yPSnOQSSZvvOjtvlLcZZI';
const CALENDAR_ID = '7e5ced2731588593e3d8e9e0e9ecf1d18d97bf982dce8e9130ae0a320685c6ae@group.calendar.google.com';

const localizer = momentLocalizer(moment);

const PublicCalendar: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);

  const getPublicCalendarEvents = async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}`
      );
      return response.data.items.map((event: any) => ({
        title: event.summary,
        start: new Date(event.start.dateTime || event.start.date),
        end: new Date(event.end.dateTime || event.end.date),
      }));
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      const events = await getPublicCalendarEvents();
      setEvents(events);
    };

    fetchEvents();
  }, []);

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h4" align="center" gutterBottom>
          Upcoming Service Disruptions
          <br/>
          Today's Date: {new Date().toLocaleDateString()}
          <br/>
          Current Time: {new Date().toLocaleTimeString()}
        </Typography>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
      </Box>
    </Container>
  );
};

export default PublicCalendar;

