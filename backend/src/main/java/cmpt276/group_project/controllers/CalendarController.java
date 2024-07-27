package cmpt276.group_project.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

import cmpt276.group_project.models.Calendar;
import cmpt276.group_project.services.CalendarService;

@RestController
@RequestMapping("/api/calendars")
public class CalendarController {

    @Autowired
    private CalendarService calendarService;

    @GetMapping("/user/{userId}")
    public List<Calendar> getAllCalendarsByUserId(@PathVariable Long userId) {
        return calendarService.getAllCalendarsByUserId(userId);
    }

    @GetMapping("/{id}")
    public Optional<Calendar> getCalendarById(@PathVariable Long id) {
        return calendarService.getCalendarById(id);
    }

    @PostMapping
    public Calendar createCalendar(@RequestBody Calendar calendar) {
        return calendarService.saveCalendar(calendar);
    }

    @DeleteMapping("/{id}")
    public void deleteCalendar(@PathVariable Long id) {
        calendarService.deleteCalendar(id);
    }
}

