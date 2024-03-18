package musinco.webapp.java_backend.controller;

import musinco.webapp.java_backend.models.User;
import musinco.webapp.java_backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path="/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;


    @PostMapping(path = "/signup")
    public @ResponseBody String signup(
            @RequestBody String username,
            @RequestBody String password,
            @RequestBody String email
    ) {
        User n = new User();
        n.setUsername(username);
        n.setPassword(password);
        n.setEmail(email);
        userRepository.save(n);
        return "signup";
    }
    @GetMapping(path="/all")
    public @ResponseBody Iterable<User> getAllUsers() {
        // This returns a JSON or XML with the users
        return userRepository.findAll();
    }

}
