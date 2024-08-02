package cmpt276.group_project.controllers;

import cmpt276.group_project.models.User;
import cmpt276.group_project.models.Route;
import cmpt276.group_project.services.UserService;
import cmpt276.group_project.config.JWT;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;


@RestController
@RequestMapping("/api/users")
public class UserController {
       
    @Autowired
    private UserService userService;

    @Autowired
    private JWT jwtUtil;
    
    //registers user and returns token and user type
    //if username already exists, returns "Username already exists"
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        User registeredUser = userService.registerUser(
            user.getUsername(), user.getPassword(), user.getUserType());
        if (registeredUser == null) {
            return ResponseEntity.status(409).body("Username already exists");
        }
        String token = jwtUtil.generateToken(registeredUser.getUsername());
        return ResponseEntity.ok(new AuthResponse(token, registeredUser.getUserType(), registeredUser.getUsername()));
    }
    
    //logs in user and returns token and user type if successful
    //otherwise returns "Invalid credentials"
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        User loggedInUser = userService.login(
            user.getUsername(), user.getPassword());
        if (loggedInUser != null) {
            String token = jwtUtil.generateToken(loggedInUser.getUsername());
            return ResponseEntity.ok(new AuthResponse(token, loggedInUser.getUserType(), loggedInUser.getUsername()));
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    //checks if token is valid.
    //returns token and user type if valid, otherwise returns "Invalid token"
    @PostMapping("/validate")
    public ResponseEntity<?> validate(@RequestBody String token) {
        String username = jwtUtil.extractUsername(token);
        User user = userService.getUser(username);
        boolean isValid = jwtUtil.validateToken(token, username);
        if (isValid) {
            return ResponseEntity.ok(new AuthResponse(token, user.getUserType(), user.getUsername()));
        }
        return ResponseEntity.status(401).body("Invalid token");
    }

    //response class for token
    //contains token and userType (0 for regular user, 1 for admin)
    static class AuthResponse {
        private String token;
        private int userType;
        private String username;

        public AuthResponse(String token, int userType, String username) {
            this.token = token;
            this.userType = userType;
            this.username = username;
        }

        //getters and setters
        public String getToken() {
            return token;
        }

        public int getUserType() {
            return userType;
        }

        public String getUsername() {
            return username;
        }

        public void setUserType(int userType) {
            this.userType = userType;
        }

        public void setToken(String token) {
            this.token = token;
        }

        public void setUsername(String username) {
            this.username = username;
        }
    }

    // When logged in, saves a route into the user's account
    @GetMapping("/saveRoute/{username}/{routeId}")
    public User saveRouteToUser(@PathVariable String username, @PathVariable int routeId) {
        return userService.saveRouteToUser(username, routeId);
    }

    // Returns the users amount of saved routes
    @GetMapping("/getRoutesAmount/{username}")
    public ResponseEntity<?> getRoutesAmount(@PathVariable String username) {
        return ResponseEntity.ok(userService.getUser(username).getRoutes().size());
    }

    // Returns the users saved routes
    @GetMapping("/getRoutes/{username}")
    public ResponseEntity<?> getRoutes(@PathVariable String username) {
        return ResponseEntity.ok(userService.getUser(username).getRoutes());
    }

    // Returns the users saved routes origin at a specific index
    @GetMapping("/getRoutesOrigin/{username}/{index}")
    public ResponseEntity<?> getRoutesOrigin(@PathVariable String username, @PathVariable int index) {
        Set<Route> routeSet = userService.getUser(username).getRoutes();
        Route[] routeArray = (routeSet).toArray(new Route[routeSet.size()]);
        String origin = routeArray[index].getOrigin();
        return ResponseEntity.ok(origin);
    }

    // Returns the users saved routes destination at a specific index
    @GetMapping("/getRoutesDestination/{username}/{i}")
    public ResponseEntity<?> getRoutesDestination(@PathVariable String username, @PathVariable int index) {
        Set<Route> routeSet = userService.getUser(username).getRoutes();
        Route[] routeArray = (routeSet).toArray(new Route[routeSet.size()]);
        String destination = routeArray[index].getDestination();
        return ResponseEntity.ok(destination);
    }

    @DeleteMapping("/deleteRoute/{username}/{origin}/{destination}") 
    public ResponseEntity<String> deleteRoute(@PathVariable String username, @PathVariable String origin, @PathVariable String destination) {
        return ResponseEntity.ok(userService.deleteRoute(username, origin, destination));
    }
}
