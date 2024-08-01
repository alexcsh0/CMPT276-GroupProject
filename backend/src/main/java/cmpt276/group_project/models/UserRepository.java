package cmpt276.group_project.models;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Integer> {
    // List<User> findByUsername(String username);

    List<User> findByUsername(String username);

    List<User> findByUserType(int userType);

    List<User> findByUsernameAndPassword(String username, String password);
}
