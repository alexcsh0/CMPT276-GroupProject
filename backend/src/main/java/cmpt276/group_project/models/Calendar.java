package cmpt276.group_project.models;

import jakarta.persistence.*;

@Entity
@Table(name = "calendar")
public class Calendar {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String startDate;

    @Column(nullable = false)
    private String endDate;

    //Constructor
    public Calendar() {}

    public Calendar(String username, String title, String startDate, String endDate) {
        this.username = username;
        this.title = title;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    //Getters
    public String getUsername() {
        return username;
    }

    public String getTitle() {
        return title;
    }

    public String getStartDate() {
        return startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public int getId() {
        return id;
    }

    //Setters
    public void setUsername(String username) {
        this.username = username;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public void setId(int id) {
        this.id = id;
    }
}
