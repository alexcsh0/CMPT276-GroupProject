package cmpt276.group_project.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cmpt276.group_project.models.Route;
import cmpt276.group_project.models.RouteRepository;
import cmpt276.group_project.models.User;
import cmpt276.group_project.models.UserRepository;

import java.util.List;
import java.util.Set;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepo;

    @Autowired
    private RouteRepository routeRepo;

    // Registers user
    public User registerUser(String username, String password, int userType) {
        List<User> users = userRepo.findByUsername(username);
        if (users.size() == 0) {
            User user = new User(username, password, userType);
            userRepo.save(user);
            return user;
        }
        return null;
    }

    // Logs in user
    public User login(String username, String password) {
        List<User> users = userRepo.findByUsernameAndPassword(username, password);
        if (users.size() == 1) {
            return users.get(0);
        }
        return null;
    }

    // Gets user by username
    public User getUser(String username) {
        List<User> users = userRepo.findByUsername(username);
        if (users.size() == 1) {
            return users.get(0);
        }
        return null;
    }

    // Saves the route to the current user
    public User saveRouteToUser(String username, int routeId) {
        Set<Route> routes = null;
        User user = userRepo.findByUsername(username).get(0);
        Route route = routeRepo.findById(routeId).get();
        routes = user.getRoutes();
        routes.add(route);
        user.setRoutes(routes);
        return userRepo.save(user);
    }

    public String deleteRoute(String username, String origin, String destination) {
        Route deletedRoute = routeRepo.findByOriginAndDestination(origin, destination).get(0);
        if(getUser(username).getRoutes().remove(deletedRoute)) {
            return "Route removed!";
        }
        return "Unable to remove.";
    }
}