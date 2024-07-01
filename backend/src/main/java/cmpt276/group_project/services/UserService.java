package cmpt276.group_project.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cmpt276.group_project.models.User;
import cmpt276.group_project.models.UserRepository;

import java.util.List;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepo;

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
}
