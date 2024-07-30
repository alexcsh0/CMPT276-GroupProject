package cmpt276.group_project.controllers;

import cmpt276.group_project.models.User;
import cmpt276.group_project.services.UserService;
import cmpt276.group_project.config.JWT;

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

    // registers user and returns token and user type
    // if username already exists, returns "Username already exists"
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        User registeredUser = userService.registerUser(
                user.getUsername(), user.getPassword(), user.getUserType());
        if (registeredUser == null) {
            return ResponseEntity.status(409).body("Username already exists");
        }
        String token = jwtUtil.generateToken(registeredUser.getUsername());
        return ResponseEntity.ok(new AuthResponse(token, registeredUser.getUserType()));
    }

    // logs in user and returns token and user type if successful
    // otherwise returns "Invalid credentials"
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        User loggedInUser = userService.login(
                user.getUsername(), user.getPassword());
        if (loggedInUser != null) {
            String token = jwtUtil.generateToken(loggedInUser.getUsername());
            return ResponseEntity.ok(new AuthResponse(token, loggedInUser.getUserType()));
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    // checks if token is valid.
    // returns token and user type if valid, otherwise returns "Invalid token"
    @PostMapping("/validate")
    public ResponseEntity<?> validate(@RequestBody String token) {
        String username = jwtUtil.extractUsername(token);
        User user = userService.getUser(username);
        boolean isValid = jwtUtil.validateToken(token, username);
        if (isValid) {
            return ResponseEntity.ok(new AuthResponse(token, user.getUserType()));
        }
        return ResponseEntity.status(401).body("Invalid token");
    }

    // changes user password for settings page
    @PostMapping("/settings/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        boolean changed = userService.changePassword(request.getUsername(), request.getOldPassword(),
                request.getNewPassword());
        if (changed) {
            return ResponseEntity.ok("Password changed successfully");
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    // response class for token
    // contains token and userType (0 for regular user, 1 for admin)
    static class AuthResponse {
        private String token;
        private int userType;

        public AuthResponse(String token, int userType) {
            this.token = token;
            this.userType = userType;
        }

        // getters and setters
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

    // Request class for change password
    static class ChangePasswordRequest {
        private String username;
        private String oldPassword;
        private String newPassword;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getOldPassword() {
            return oldPassword;
        }

        public void setOldPassword(String oldPassword) {
            this.oldPassword = oldPassword;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }
}
