package musinco.webapp.java_backend.repositories;

import musinco.webapp.java_backend.models.Users;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<Users, Long> {
    Users findFirstByUsername(String username);
    Users findFirstByEmail(String email);
}
