// src/components/CalendarComponent.tsx

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios';
import { Calendar, Event } from './types';

interface CalendarComponentProps {
    userId: number;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ userId }) => {
    const [calendars, setCalendars] = useState<Calendar[]>([]);
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        const fetchCalendars = async () => {
            try {
                const response = await axios.get<Calendar[]>(`http://localhost:8090/api/calendars/user/${userId}`);
                setCalendars(response.data);
                if (response.data.length > 0) {
                    fetchEvents(response.data[0].id);
                }
            } catch (error) {
                console.error('Error fetching calendars:', error);
            }
        };

        const fetchEvents = async (calendarId: number) => {
            try {
                const response = await axios.get<Event[]>(`http://localhost:8090/api/CalendarEvents/calendar/${calendarId}`);
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchCalendars();
    }, [userId]);
    
    return (
        <div>
            {/* @ts-expect-error Server Component */}
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={events.map(event => ({
                    id: event.id.toString(),
                    title: event.title,
                    start: event.start,
                    end: event.end
                }))}
            />
        </div>
    );
};

export default CalendarComponent;
