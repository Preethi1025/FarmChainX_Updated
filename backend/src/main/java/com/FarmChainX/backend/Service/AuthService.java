package com.FarmChainX.backend.Service;

import com.FarmChainX.backend.Model.User;
import com.FarmChainX.backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    // Register
    public User register(User user) {

        // generate random ID
        user.setId(UUID.randomUUID().toString());

        // hash password
        user.setPassword(encoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    // Login
    public boolean login(String email, String password) {
        User user = userRepository.findByEmail(email);

        if (user == null) return false;

        return encoder.matches(password, user.getPassword());
    }

    public User getUser(String email) {
        return userRepository.findByEmail(email);
    }
}
