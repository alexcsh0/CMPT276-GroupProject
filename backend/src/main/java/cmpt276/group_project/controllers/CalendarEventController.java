package cmpt276.group_project.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

import cmpt276.group_project.models.CalendarEvent;
import cmpt276.group_project.services.CalendarEventService;

@RestController
@RequestMapping("/api/CalendarEvents")
public class CalendarEventController {

    @Autowired
    private CalendarEventService CalendarEventService;

    @GetMapping("/calendar/{calendarId}")
    public List<CalendarEvent> getAllCalendarEventsByCalendarId(@PathVariable Long calendarId) {
        return CalendarEventService.getAllCalendarEventsByCalendarId(calendarId);
    }

    @GetMapping("/{id}")
    public Optional<CalendarEvent> getCalendarEventById(@PathVariable Long id) {
        return CalendarEventService.getCalendarEventById(id);
    }

    @PostMapping
    public CalendarEvent createCalendarEvent(@RequestBody CalendarEvent CalendarEvent) {
        return CalendarEventService.saveCalendarEvent(CalendarEvent);
    }

    @DeleteMapping("/{id}")
    public void deleteCalendarEvent(@PathVariable Long id) {
        CalendarEventService.deleteCalendarEvent(id);
    }
}

