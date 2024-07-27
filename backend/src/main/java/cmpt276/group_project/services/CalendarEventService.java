package cmpt276.group_project.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import cmpt276.group_project.models.CalendarEvent;
import cmpt276.group_project.models.CalendarEventRepository;

@Service
public class CalendarEventService {

    @Autowired
    private CalendarEventRepository CalendarEventRepository;

    public List<CalendarEvent> getAllCalendarEventsByCalendarId(Long calendarId) {
        return CalendarEventRepository.findByCalendarId(calendarId);
    }

    public Optional<CalendarEvent> getCalendarEventById(Long id) {
        return CalendarEventRepository.findById(id);
    }

    public CalendarEvent saveCalendarEvent(CalendarEvent CalendarEvent) {
        return CalendarEventRepository.save(CalendarEvent);
    }

    public void deleteCalendarEvent(Long id) {
        CalendarEventRepository.deleteById(id);
    }
}

