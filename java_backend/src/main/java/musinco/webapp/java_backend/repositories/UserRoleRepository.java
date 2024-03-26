package musinco.webapp.java_backend.repositories;

import musinco.webapp.java_backend.models.UserRole;
import musinco.webapp.java_backend.models.UserRoleId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRoleRepository extends JpaRepository<UserRole, UserRoleId> {

}