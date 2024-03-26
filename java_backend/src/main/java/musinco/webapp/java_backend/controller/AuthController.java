package musinco.webapp.java_backend.controller;

import musinco.webapp.java_backend.models.Artist;
import musinco.webapp.java_backend.repositories.ArtistRepository;
import musinco.webapp.java_backend.repositories.UserRepository;
import musinco.webapp.java_backend.services.ArtistService;
import musinco.webapp.java_backend.services.JwtService;
import musinco.webapp.java_backend.services.UserService;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping(path = "/api/v1/auth")
public class AuthController {

    @Autowired
    private  UserService userService ;
    @Autowired
    private  ArtistService artistService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;
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
        Artist artist = artistService.registerArtist(body.username);
        try {
            if (artist == null) {
                log.error("Error registering artist");
                return ResponseEntity.badRequest().body("Error registering artist");
            }
            userService.registerUser(artist, body.username, body.password, body.email);
        }catch (Exception e){
            log.error("Error registering user: {}", e.getMessage());
            for(StackTraceElement trace: e.getStackTrace()){
                if(trace.toString().contains("musinco")){
                    log.error("Trace: {}", trace);
                }
            }
            artistService.deleteArtist(artist);
            return ResponseEntity.badRequest().body("Error registering user");
        }




        return ResponseEntity.ok().body("User registered");
    }

@Autowired
private UserRepository userRepository;
    @Autowired
    private ArtistRepository artistRepository;

    @PostMapping(path = "/signin")
    public @ResponseBody String signin(
            @RequestBody UserRequest body
    ) {
        log.info("Authenticating user: {}", body.username);
        try{
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                body.username,
                body.password
        ));

        if (authentication.isAuthenticated()) {
            log.info("User authenticated: {}", body.username);
            return jwtService.generateToken(body.username);
        }else {
            log.info("User not authenticated: {}", body.username);
            throw new UsernameNotFoundException("User not found with username: " + body.username);
        }
        }catch (Exception e){
            log.error("Error authenticating user: {}", e.getMessage());
            throw new UsernameNotFoundException("User not found with username: " + body.username);
        }
    }


}
