package cmpt276.group_project.models;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int uid;
    private String username;
    private String password;
    private int userType;

    //constructors
    public User() {}

    public User(String username, String password, int userType) {
        this.username = username;
        this.password = password;
        this.userType = userType;
    }

    //getters
    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public int getUserType() {
        return userType;
    }

    public int getUid() {
        return uid;
    }

    //setters
    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setUserType(int userType) {
        this.userType = userType;
    }

    public void setUid(int uid) {
        this.uid = uid;
    }
}
