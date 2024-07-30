package cmpt276.group_project.controllers;

import cmpt276.group_project.models.Alert;
import cmpt276.group_project.services.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedList;
import java.util.LinkedList;
import java.util.List;

import java.net.URL;
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

            Alert alert = new Alert(entity.getAlert().getHeaderText().toString(),
                    entity.getAlert().getCause().getValueDescriptor().toString(), entity.getAlert().getDescriptionText().toString());
            res.add(alert);
        }
        return res;
    }
}
