package musinco.webapp.java_backend.services;

import musinco.webapp.java_backend.models.Users;
import musinco.webapp.java_backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServices {

    @Autowired
    private UserRepository userRepository;

    public  void saveUser(Users user) {
        userRepository.save(user);
    }
    public Iterable<Users> getAllUsers() {
        return userRepository.findAll();
    }
}
