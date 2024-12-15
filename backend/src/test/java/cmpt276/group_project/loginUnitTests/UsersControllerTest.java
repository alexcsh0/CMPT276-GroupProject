package cmpt276.group_project.loginUnitTests;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import cmpt276.group_project.controllers.UserController;
import cmpt276.group_project.models.UserRepository;
import cmpt276.group_project.models.User;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import cmpt276.group_project.config.JWT;
import cmpt276.group_project.services.UserService;
import static org.mockito.Mockito.when;

import java.nio.charset.Charset;

@WebMvcTest(UserController.class)
public class UsersControllerTest {
    
    public static final MediaType APPLICATION_JSON_UTF8 = new MediaType(
        MediaType.APPLICATION_JSON.getType(),
        MediaType.APPLICATION_JSON.getSubtype(),
        Charset.forName("utf8")
    );

    @MockBean
    private UserRepository userRepo;

    @MockBean
    private JWT jwtUtil;

    @MockBean
    private UserService userService;

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testRegister() throws Exception {
        // Create a mock registeredUser object
        User registeredUser = new User();
        registeredUser.setUsername("user");
        registeredUser.setPassword("1234");
        registeredUser.setUserType(0);
    
        // Create a mock token
        String token = "mockToken";
    
        // Mock the userService.registerUser() method
        when(userService.registerUser(anyString(), anyString(), anyInt())).thenReturn(registeredUser);
    
        // Mock the jwtUtil.generateToken() method
        when(jwtUtil.generateToken(anyString())).thenReturn(token);
    
        // Perform the register request
        try {
            mockMvc.perform(post("/api/users/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"username\":\"testUser\",\"password\":\"testPassword\",\"userType\":0}")
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.token").value(token))
                    .andExpect(jsonPath("$.userType").value(registeredUser.getUserType()));
        } catch (Exception e) {
            fail();
        }
    }

    @Test
    public void testRegisterUsernameExists() throws Exception {
        // Create a mock registeredUser object
        User registeredUser = new User();
        registeredUser.setUsername("user");
        registeredUser.setPassword("1234");
        registeredUser.setUserType(0);
    
        // Mock the userService.registerUser() method
        when(userService.registerUser(anyString(), anyString(), anyInt())).thenReturn(null);
    
        // Perform the register request
        try {
            mockMvc.perform(post("/api/users/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"username\":\"testUser\",\"password\":\"testPassword\",\"userType\":0}")
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isConflict())
                    .andExpect(MockMvcResultMatchers.content().string("Username already exists"));
        } catch (Exception e) {
            fail();
        }
    }

    @Test
    public void testLogin() throws Exception {
        // Create a mock loggedInUser object
        User loggedInUser = new User();
        loggedInUser.setUsername("user");
        loggedInUser.setPassword("1234");
        loggedInUser.setUserType(0);
    
        // Create a mock token
        String token = "mockToken";
    
        // Mock the userService.login() method
        when(userService.login(anyString(), anyString())).thenReturn(loggedInUser);
    
        // Mock the jwtUtil.generateToken() method
        when(jwtUtil.generateToken(anyString())).thenReturn(token);
    
        // Perform the login request
        try {
            mockMvc.perform(post("/api/users/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"username\":\"testUser\",\"password\":\"testPassword\",\"userType\":0}")
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.token").value(token))
                    .andExpect(jsonPath("$.userType").value(loggedInUser.getUserType()));
        } catch (Exception e) {
            fail();
        }
    }

    @Test
    public void testLoginInvalidCredentials() throws Exception {
        // Mock the userService.login() method
        when(userService.login(anyString(), anyString())).thenReturn(null);
    
        // Perform the login request
        try {
            mockMvc.perform(post("/api/users/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"username\":\"testUser\",\"password\":\"testPassword\",\"userType\":0}")
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isUnauthorized())
                    .andExpect(MockMvcResultMatchers.content().string("Invalid credentials"));
        } catch (Exception e) {
            fail();
        }
    }

    @Test
    public void testValidate() throws Exception {
        // Create a mock user object
        User user = new User();
        user.setUsername("user");
        user.setPassword("1234");
        user.setUserType(0);
    
        // Create a mock token
        String token = "mockToken";
    
        // Mock the jwtUtil.extractUsername() method
        when(jwtUtil.extractUsername(anyString())).thenReturn(user.getUsername());
    
        // Mock the userService.getUser() method
        when(userService.getUser(anyString())).thenReturn(user);
    
        // Mock the jwtUtil.validateToken() method
        when(jwtUtil.validateToken(anyString(), anyString())).thenReturn(true);
    
        // Perform the validate request
        try {
            mockMvc.perform(post("/api/users/validate")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(token)
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.token").value(token))
                    .andExpect(jsonPath("$.userType").value(user.getUserType()));
        } catch (Exception e) {
            fail();
        }
    }

    @Test
    public void testValidateInvalidToken() throws Exception {
        // Create a mock user object
        User user = new User();
        user.setUsername("user");
        user.setPassword("1234");
        user.setUserType(0);
    
        // Create a mock token
        String token = "mockToken";
    
        // Mock the jwtUtil.extractUsername() method
        when(jwtUtil.extractUsername(anyString())).thenReturn(user.getUsername());
    
        // Mock the userService.getUser() method
        when(userService.getUser(anyString())).thenReturn(user);
    
        // Mock the jwtUtil.validateToken() method
        when(jwtUtil.validateToken(anyString(), anyString())).thenReturn(false);
    
        // Perform the validate request
        try {
            mockMvc.perform(post("/api/users/validate")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(token)
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isUnauthorized())
                    .andExpect(MockMvcResultMatchers.content().string("Invalid token"));
        } catch (Exception e) {
            fail();
        }
    }
}
