package cmpt276.group_project.controllers;

import cmpt276.group_project.models.User;
import cmpt276.group_project.models.Alert;
import cmpt276.group_project.services.UserService;
import cmpt276.group_project.services.AlertService;
import cmpt276.group_project.config.JWT;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AlertService alertService;

    @Autowired
    private JWT jwtUtil;

    // Registers user and returns token and user type
    // If username already exists, returns "Username already exists"
    @PostMapping("/users/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        User registeredUser = userService.registerUser(
            user.getUsername(), user.getPassword(), user.getUserType());
        if (registeredUser == null) {
            return ResponseEntity.status(409).body("Username already exists");
        }
        String token = jwtUtil.generateToken(registeredUser.getUsername());
        return ResponseEntity.ok(new AuthResponse(token, registeredUser.getUserType()));
    }

    // Logs in user and returns token and user type if successful
    // Otherwise returns "Invalid credentials"
    @PostMapping("/users/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        User loggedInUser = userService.login(
            user.getUsername(), user.getPassword());
        if (loggedInUser != null) {
            String token = jwtUtil.generateToken(loggedInUser.getUsername());
            return ResponseEntity.ok(new AuthResponse(token, loggedInUser.getUserType()));
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    // Checks if token is valid
    // Returns token and user type if valid, otherwise returns "Invalid token"
    @PostMapping("/users/validate")
    public ResponseEntity<?> validate(@RequestBody String token) {
        String username = jwtUtil.extractUsername(token);
        User user = userService.getUser(username);
        boolean isValid = jwtUtil.validateToken(token, username);
        if (isValid) {
            return ResponseEntity.ok(new AuthResponse(token, user.getUserType()));
        }
        return ResponseEntity.status(401).body("Invalid token");
    }

    // Creates a new alert
    @PostMapping("/alerts")
    public ResponseEntity<?> createAlert(@RequestBody Alert alert) {
        Alert createdAlert = alertService.createAlert(alert);
        return ResponseEntity.ok(createdAlert);
    }

    // Retrieves all alerts
    @GetMapping("/alerts")
    public ResponseEntity<?> getAllAlerts() {
        List<Alert> alerts = alertService.getAllAlerts();
        return ResponseEntity.ok(alerts);
    }

    // Response class for token
    // Contains token and userType (0 for regular user, 1 for admin)
    static class AuthResponse {
        private String token;
        private int userType;

        public AuthResponse(String token, int userType) {
            this.token = token;
            this.userType = userType;
        }

        // Getters and setters
        public String getToken() {
            return token;
        }

        public int getUserType() {
            return userType;
        }

        public void setUserType(int userType) {
            this.userType = userType;
        }

        public void setToken(String token) {
            this.token = token;
        }
    }
}
