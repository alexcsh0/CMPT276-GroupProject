package cmpt276.group_project.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cmpt276.group_project.models.Route;
import cmpt276.group_project.models.RouteRepository;
import java.util.List;

@Service
public class RouteService {
    
    @Autowired
    private RouteRepository routeRepo;

    public Route addRoute(String origin, String destination) {
        List<Route> routes = routeRepo.findByOriginAndDestination(origin, destination);
        
        // Add route to database if database does not have route with same origin and destination
        if(routes.size() == 0) {
            Route route = new Route(origin, destination);
            routeRepo.save(route);
            return route;
        }
        // Return the existing route otherwise
        return null;
    }

    // Returns only the route that has not yet existed in the database, else return null
    public Route getRoute(String origin, String destination) {
        List<Route> routes = routeRepo.findByOriginAndDestination(origin, destination);
        if (routes.size() == 1) {
            return routes.get(0);
        }
        return null;
    }
}
