package cmpt276.group_project.models;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CalendarRepository extends JpaRepository<Calendar, Integer> {
    List<Calendar> findByUsername(String username);
}
