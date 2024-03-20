package musinco.webapp.java_backend.controller;

import musinco.webapp.java_backend.models.Artist;
import musinco.webapp.java_backend.models.Users;
import musinco.webapp.java_backend.repositories.ArtistRepository;
import musinco.webapp.java_backend.repositories.UserRepository;
import musinco.webapp.java_backend.services.ArtistService;
import musinco.webapp.java_backend.services.UserService;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping(path = "/auth")
public class AuthController {

    @Autowired
    private  UserService userService ;
    @Autowired
    private  ArtistService artistService;
    private static class UserRequest {
        public String username;
        public String password;
        public String email;
        public List<String> roles;

        @Override
        public String toString() {
            return "UserRequest{" +
                    "username='" + username + '\'' +
                    ", password='" + password + '\'' +
                    ", email='" + email + '\'' +
                    ", roles=" + roles +
                    '}';

        }
    }

    private static final Logger log = org.slf4j.LoggerFactory.getLogger(AuthController.class);

    @PostMapping(path = "/signup",
            consumes = "application/json",
            produces = "application/json")
    public @ResponseBody ResponseEntity<Object> signup(
            @RequestBody UserRequest body
    ) {

        log.info("Registering user: {}", body.username);
        if(artistService.checkArtistExists(body.username)){
            return ResponseEntity.badRequest().body("Artist already exists");
        }
        if (userService.checkDuplicateUserOrEmail(body.username, body.email)) {
            return ResponseEntity.badRequest().body("Username or email already taken");
        }
        Artist artist = artistService.registerNewArtist(body.username);
        userService.registerUser(artist, body.username, body.password, body.email);




        return ResponseEntity.ok().body("User registered");
    }

    @PostMapping(path = "/signin")
    public @ResponseBody String signin(
            @RequestBody UserRequest body
    ) {
        return "signin";
    }


}
