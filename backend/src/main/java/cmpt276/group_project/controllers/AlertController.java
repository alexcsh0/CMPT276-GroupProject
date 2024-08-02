package cmpt276.group_project.controllers;

import cmpt276.group_project.models.Alert;
import cmpt276.group_project.services.AlertService;
import cmpt276.group_project.models.Calendar;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedList;
import java.util.List;

import java.net.URL;
import java.time.format.DateTimeFormatter;
import java.time.LocalDateTime;
import java.time.Instant;
import java.time.ZoneId;
import java.util.Optional;

import com.google.transit.realtime.GtfsRealtime.FeedEntity;
import com.google.transit.realtime.GtfsRealtime.FeedMessage;


@RestController
@RequestMapping("/api/alerts")
public class AlertController {
    @Autowired
    private AlertService alertService;

    @PostMapping
    public Alert createAlert(@RequestBody Alert alert) {
        return alertService.createAlert(alert);
    }

    @GetMapping
    public List<Alert> getAllAlerts() {
        return alertService.getAllAlerts();
    }

    @PostMapping("offAlerts")
    public List<Alert> offAlerts() throws Exception {
        URL url = new URL("https://gtfsapi.translink.ca/v3/gtfsalerts?apikey=T3i6sh8RnDcRGi4Y2yVF");
        FeedMessage feed = FeedMessage.parseFrom(url.openStream());
        System.out.println(feed.getEntityList().size());
        List<Alert> res = new LinkedList<>();
        for (FeedEntity entity : feed.getEntityList()) {
            String head = entity.getAlert().getHeaderText().toString();
            String body = entity.getAlert().getDescriptionText().toString();
            try {
                String h = head.substring(23, head.substring(23).indexOf("\"")+21);
                String b = body.substring(23, body.substring(23).indexOf("\"")+21);
                Alert alert = new Alert(h,
                        entity.getAlert().getCause().getValueDescriptor().toString(), b);
                res.add(alert);
            } catch (Exception e) {
                continue;
            }
        }
        return res;
    }

    @PostMapping("addEvent")
    public Optional<Calendar> offEvent() throws Exception {
        URL url = new URL("https://gtfsapi.translink.ca/v3/gtfsalerts?apikey=T3i6sh8RnDcRGi4Y2yVF");
        FeedMessage feed = FeedMessage.parseFrom(url.openStream());
        //List<Calendar> res = new LinkedList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        for (FeedEntity entity : feed.getEntityList()) {
            if (entity.getAlert().getActivePeriodCount() > 0 && entity.getAlert().getActivePeriod(0).getEnd() > 0) {
                String header = entity.getAlert().getHeaderText().toString();
                header = header.substring(23, header.substring(23).indexOf("\"")+21);
                String startDate = null;
                String endDate = null;
                
                long startSeconds = entity.getAlert().getActivePeriod(0).getStart();
                long endSeconds = entity.getAlert().getActivePeriod(0).getEnd();

                LocalDateTime startDateTime = LocalDateTime.ofInstant(Instant.ofEpochSecond(startSeconds), ZoneId.systemDefault());
                LocalDateTime endDateTime = LocalDateTime.ofInstant(Instant.ofEpochSecond(endSeconds), ZoneId.systemDefault());

                startDate = startDateTime.format(formatter);
                endDate = endDateTime.format(formatter);

                if (!startDate.equals(endDate)) {
                    Calendar event = new Calendar("Translink", header, startDate, endDate);
                    //res.add(event);
                    return Optional.of(event);
                }
            }
        }
        return Optional.empty();
    }
}
