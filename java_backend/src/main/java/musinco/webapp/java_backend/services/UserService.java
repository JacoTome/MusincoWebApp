package musinco.webapp.java_backend.services;

import musinco.webapp.java_backend.config.ERole;
import musinco.webapp.java_backend.models.Artist;
import musinco.webapp.java_backend.models.UserRole;
import musinco.webapp.java_backend.models.UserRoleId;
import musinco.webapp.java_backend.models.Users;
import musinco.webapp.java_backend.repositories.RoleRepository;
import musinco.webapp.java_backend.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Set;

@Service
public class UserService implements UserDetailsService {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;

    /**
     * Registration process for a new user
     *
     * @return code process result
     * 1. Create a new Artist
     * 2. Create a new User based on the Artist
     * 3. Register on Jena
     * 4. Query roles from req body and assign to user
     * 4.1 Set default if not found
     * 5. Send Response
     */


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users user = userRepository.findFirstByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }
        return new UserInfoDetails(user);
    }

    public void registerUser(Artist artist, String username, String password, String email) {

        log.info("Registering user: {}", username);
        String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt(10));
        Users newUser = new Users();
        if (artist == null) {
            log.error("Artist not found");
            return;
        }
        newUser.setArtist(artist);
        newUser.setUserId(artist.getArtist_id());
        newUser.setUsername(username);
        newUser.setPassword(hashedPassword);
        newUser.setEmail(email);


        // Create default user role
        UserRoleId userRoleId = new UserRoleId();
        userRoleId.setUserId(newUser.getUserId());
        userRoleId.setRoleId(1);
        UserRole newUserRole = new UserRole();
        newUserRole.setId(userRoleId);
        newUserRole.setUsers(newUser);
        newUserRole.setRoles(roleRepository.findFirstByName(ERole.user));
        newUserRole.setCreatedAt(Instant.now());
        newUserRole.setUpdatedAt(Instant.now());
        newUser.setUserRoles(Set.of(newUserRole));
        userRepository.saveAndFlush(newUser);


        // TODO: Save on Jena Fuseki
    }

    public Boolean checkDuplicateUserOrEmail(String username, String email) {
        return userRepository.findFirstByUsername(username) != null || userRepository.findFirstByEmail(email) != null;
    }


}
