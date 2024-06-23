package cmpt276.group_project.controllers;

import java.util.Map;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import cmpt276.group_project.models.User;
import cmpt276.group_project.models.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;



@Controller
public class UsersController {

    @Autowired
    private UserRepository userRepo;
    
    @GetMapping("/login")
    public String getLogin(Model model, HttpServletRequest request, HttpSession session) {

        User user = (User) session.getAttribute("session_user");

        if (user == null) {
            return "login";
        }
        else {
            model.addAttribute("user", user);
            return "login";
        } 
    }

    @PostMapping("login")
    public String login(@RequestParam Map<String, String> formData, Model model, HttpServletRequest request, HttpSession session) {
        String name = formData.get("name");
        String pwd = formData.get("password");
        List<User> userlist = userRepo.findByNameAndPassword(name, pwd);
        if (userlist.isEmpty()) {
            return "login";
        }
        else {
            User user = userlist.get(0);
            request.getSession().setAttribute("session_user", user);
            model.addAttribute("user", user);
            return "login";
        }
    }
    
}
