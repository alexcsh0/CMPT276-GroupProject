package cmpt276.group_project.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import cmpt276.group_project.models.User;
import cmpt276.group_project.models.UserRepository;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Registers user
    public User registerUser(String username, String password, int userType) {
        List<User> users = userRepo.findByUsername(username);
        if (users.size() == 0) {
            String encodedPassword = passwordEncoder.encode(password);
            User user = new User(username, encodedPassword, userType);
            userRepo.save(user);
            return user;
        }
        return null;
    }

    // Logs in user
    public User login(String username, String password) {
        List<User> users = userRepo.findByUsernameAndPassword(username, password);
        if (users.size() == 1 && passwordEncoder.matches(password, users.get(0).getPassword())) {
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

    // Changes user password
    public boolean changePassword(String username, String oldPassword, String newPassword) {
        List<User> users = userRepo.findByUsername(username);
        if (users.size() == 1 && passwordEncoder.matches(oldPassword, users.get(0).getPassword())) {
            User user = users.get(0);
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepo.save(user);
            return true;
        }
        return false;
    }

    public void save(User user) {
        userRepo.save(user);
    }
}
