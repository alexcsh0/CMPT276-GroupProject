package cmpt276.group_project.services;

import cmpt276.group_project.models.Alert;
import cmpt276.group_project.models.AlertRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlertService {

    @Autowired
    private AlertRepository alertRepo;

    public Alert createAlert(Alert alert) {
        return alertRepo.save(alert);
    }

    public List<Alert> getAllAlerts() {
        return alertRepo.findAll();
    }
}
