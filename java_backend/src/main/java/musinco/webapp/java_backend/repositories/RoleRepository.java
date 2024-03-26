package musinco.webapp.java_backend.repositories;


import musinco.webapp.java_backend.config.ERole;
import musinco.webapp.java_backend.models.Roles;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Roles, Long> {
    Roles findFirstByName(ERole name);

}
