package cmpt276.group_project.models;

public class User {
    private String username;
    private String password;

    //constructors
    public User() {}

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    //getters
    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    //setters
    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
