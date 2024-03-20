package musinco.webapp.java_backend.services;

import musinco.webapp.java_backend.models.Artist;
import musinco.webapp.java_backend.models.Users;
import musinco.webapp.java_backend.repositories.ArtistRepository;
import musinco.webapp.java_backend.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;


    /**
     * Registration process for a new user
     * @return code process result
     * 1. Create a new Artist
     * 2. Create a new User based on the Artist
     * 3. Register on Jena
     * 4. Query roles from req body and assign to user
     * 4.1 Set default if not found
     * 5. Send Response
     */

    public Users registerUser(Artist artist,String username, String password, String email) {

        log.info("Registering user: {}", username);
        String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt(10));
        Users newUser = new Users();
        newUser.setArtist(artist);
        newUser.setUsername(username);
        newUser.setPassword(hashedPassword);
        newUser.setEmail(email);

        // TODO: Save on Jena Fuseki
        return userRepository.save(newUser);

    }
    public Boolean checkDuplicateUserOrEmail(String username, String email) {
        return userRepository.findFirstByUsername(username) != null || userRepository.findFirstByEmail(email) != null;
    }

}
