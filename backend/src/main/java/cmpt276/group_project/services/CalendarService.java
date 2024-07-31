package cmpt276.group_project.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cmpt276.group_project.models.Calendar;
import cmpt276.group_project.models.CalendarRepository;

import java.util.List;

@Service
public class CalendarService {
    
    @Autowired
    private CalendarRepository calendarRepo;

    // Adds calendar event
    public Calendar addCalendarEvent(String username, String title, String startDate, String endDate) {
        Calendar calendar = new Calendar(username, title, startDate, endDate);
        calendarRepo.save(calendar);
        return calendar;
    }

    // Gets calendar events by username
    public List<Calendar> getCalendarEvents(String username) {
        return calendarRepo.findByUsername(username);
    }
}
