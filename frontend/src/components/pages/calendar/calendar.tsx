import React from 'react';
import CalendarComponent from '../../common/calendar/calendar';
import { NavBar } from '../../common/navbar/navbar';
import { Footer } from '../../common/footer/footer';

export function GetCalendar() {
    return (
        <div>
            <NavBar />
            <CalendarComponent userId={1} />
            <Footer />
        </div>
    );
}

export default GetCalendar;