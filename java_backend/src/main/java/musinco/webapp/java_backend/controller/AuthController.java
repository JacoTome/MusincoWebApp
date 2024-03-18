package musinco.webapp.java_backend.controller;

import musinco.webapp.java_backend.models.Users;
import musinco.webapp.java_backend.repositories.UserRepository;
import musinco.webapp.java_backend.services.UserServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path="/auth")
public class AuthController {

    private UserServices userServices;

    @PostMapping(path = "/signup")
    public @ResponseBody String signup(
            @RequestBody String username,
            @RequestBody String password,
            @RequestBody String email
    ) {
        Users n = new Users();
        n.setUsername(username);
        n.setPassword(password);
        n.setEmail(email);
        userServices.saveUser(n);
        return "signup";
    }
    @PostMapping(path= "/signin")
    public @ResponseBody String signin(
            @RequestBody String username,
            @RequestBody String password
    ) {
        return "signin";
    }


}
