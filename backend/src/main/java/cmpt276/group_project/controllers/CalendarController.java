package cmpt276.group_project.controllers;

import cmpt276.group_project.models.Calendar;
import cmpt276.group_project.services.CalendarService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/calendars")
public class CalendarController {

    @Autowired
    private CalendarService calendarService;

    // Adds calendar event
    @PostMapping("/add")
    public ResponseEntity<?> addCalendarEvent(@RequestBody Calendar calendar) {
        Calendar addedCalendar = calendarService.addCalendarEvent(
            calendar.getUsername(), calendar.getTitle(), calendar.getStartDate(), calendar.getEndDate());
        if (addedCalendar == null) {
            return ResponseEntity.status(409).body("Failed to add calendar event");
        }
        return ResponseEntity.ok(addedCalendar);
    }

    // Gets calendar events by username
    @GetMapping("/get")
    public ResponseEntity<?> getCalendarEvents(@RequestParam String username) {
        return ResponseEntity.ok(calendarService.getCalendarEvents(username));
    }
}
