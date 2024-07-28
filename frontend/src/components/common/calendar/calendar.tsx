import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
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
    const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '' });

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

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewEvent(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddEvent = (e: FormEvent) => {
        e.preventDefault();
        if (calendars.length === 0) {
            console.error('No calendars available to add events.');
            return;
        }
        
        const calendarId = calendars[0].id;
        const eventInput: Event = {
            id: Date.now(), // Generating a unique ID for the new event
            title: newEvent.title,
            start: newEvent.start,
            end: newEvent.end,
            calendarId
        };
        setEvents(prevEvents => [...prevEvents, eventInput]);
        setNewEvent({ title: '', start: '', end: '' });
    };

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
            <form onSubmit={handleAddEvent} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                    type="text"
                    name="title"
                    value={newEvent.title}
                    onChange={handleInputChange}
                    placeholder="Event Title"
                    required
                />
                <input
                    type="date"
                    name="start"
                    value={newEvent.start}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="date"
                    name="end"
                    value={newEvent.end}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit">Add Event</button>
            </form>
        </div>
    );
};

export default CalendarComponent;
