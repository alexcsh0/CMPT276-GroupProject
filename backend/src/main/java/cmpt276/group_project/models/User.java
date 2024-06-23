package cmpt276.group_project.models;

public class User {
    // Attributes
    private String name;
    private String password;

    // Constructors
    public User() {

    }

    public User(String name, String password) {
        this.name = name;
        this.password = password;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    
}
