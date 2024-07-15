package cmpt276.group_project.services;

import cmpt276.group_project.models.Alert;
import cmpt276.group_project.models.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AlertService {
    @Autowired
    private AlertRepository alertRepository;

    public Alert createAlert(Alert alert) {
        alert.setCreatedAt(LocalDateTime.now());
        return alertRepository.save(alert);
    }

    public List<Alert> getAllAlerts() {
        return alertRepository.findAll();
    }

    public Optional<Alert> getAlertById(int id) {
        return alertRepository.findById(id);
    }

    public List<Alert> getAlertsByTitle(String title) {
        return alertRepository.findByTitle(title);
    }

    public List<Alert> getAlertsByAffectedService(String affectedService) {
        return alertRepository.findByAffectedService(affectedService);
    }

    public void deleteAlert(int id) {
        alertRepository.deleteById(id);
    }
}
