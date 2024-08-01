import Calendar from '../../common/calendar/getCalendar';
import { NavBar } from '../../common/navbar/navbar';
import { Footer } from '../../common/footer/footer';

export function GetCalendar() {
    return (
        <>
            <NavBar />
            <Calendar />
            <Footer />
        </>
    );
};

export default GetCalendar;
