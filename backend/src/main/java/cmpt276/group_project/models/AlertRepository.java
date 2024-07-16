package cmpt276.group_project.models;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Integer> {
    List<Alert> findByTitle(String title);

    List<Alert> findByAffectedService(String affectedService);
}
