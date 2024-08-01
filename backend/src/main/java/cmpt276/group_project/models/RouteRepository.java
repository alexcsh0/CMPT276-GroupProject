package cmpt276.group_project.models;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface RouteRepository extends JpaRepository<Route, Integer> {
    List<Route> findByOrigin(String origin);

    List<Route> findByDestination(String destination);

    List<Route> findByOriginAndDestination(String origin, String destination);
}

