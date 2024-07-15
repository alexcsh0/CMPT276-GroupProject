package cmpt276.group_project.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String affectedService;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    // constructors
    public Alert() {
    }

    public Alert(String title, String affectedService, String message) {
        this.title = title;
        this.affectedService = affectedService;
        this.message = message;
        this.createdAt = LocalDateTime.now();
    }

    // getters
    public int getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getAffectedService() {
        return affectedService;
    }

    public String getMessage() {
        return message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // setters
    public void setTitle(String title) {
        this.title = title;
    }

    public void setAffectedService(String affectedService) {
        this.affectedService = affectedService;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
