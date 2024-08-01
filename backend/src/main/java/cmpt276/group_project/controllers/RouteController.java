package cmpt276.group_project.controllers;

import cmpt276.group_project.models.Route;
import cmpt276.group_project.models.RouteRepository;
import cmpt276.group_project.services.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/routes")
public class RouteController {
       
    @Autowired
    private RouteService routeService;

    @Autowired
    private RouteRepository routeRepo;

    // Return added route with the given data passed through from getRoute.tsx
    @PostMapping("/addRoute")
    public ResponseEntity<?> addRoute(@RequestBody Route route) {
        Route addedRoute = routeService.addRoute(route.getOrigin(), route.getDestination());
        if (addedRoute == null) {
            // return ResponseEntity.status(409).body("Route already exists");
            Route existedRoute = routeRepo.findByOriginAndDestination(route.getOrigin(), route.getDestination()).get(0);
            return ResponseEntity.ok(existedRoute.getId());
        }
        return ResponseEntity.ok(addedRoute.getId());
    }
}

