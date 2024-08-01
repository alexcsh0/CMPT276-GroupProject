package cmpt276.group_project.models;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;

@Entity
@Table(name = "routes")
public class Route {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String origin;

    @Column(nullable = false)
    private String destination;

    @ManyToMany(mappedBy = "routes", fetch = FetchType.LAZY)
    private Set<User> users = new HashSet<>();

    public Route() {}

    public Route(String origin, String destination) {
        this.origin = origin;
        this.destination = destination;
    }

    public int getId() {
        return id;
    }

    public String getOrigin() {
        return origin;
    }

    public String getDestination() {
        return destination;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }
}

