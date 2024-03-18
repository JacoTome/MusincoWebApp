package musinco.webapp.java_backend.repositories;

import musinco.webapp.java_backend.models.User;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface UserRepository extends CrudRepository<User, Long> {
}
