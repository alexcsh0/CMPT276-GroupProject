package cmpt276.group_project.models;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private int userType;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_routes",
        joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "route_id", referencedColumnName = "id")
    )
    private Set<Route> routes = new HashSet<>();

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

    public int getid() {
        return id;
    }

    public Set<Route> getRoutes() {
        return routes;
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

    public void setid(int id) {
        this.id = id;
    }

    public void setRoutes(Set<Route> routes) {
        this.routes = routes;
    }
}
