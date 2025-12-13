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

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    // ---------------- REGISTER ----------------
    public User register(User user) {

        // 🔴 BLOCK duplicate email across ALL roles
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new IllegalArgumentException("Email already exists");
        }

        user.setId(UUID.randomUUID().toString());
        user.setPassword(encoder.encode(user.getPassword()));

        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("BUYER");
        }

        user.setBlocked(false);

        return userRepository.save(user);
    }

    // ---------------- LOGIN ----------------
    public boolean login(String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user == null) return false;

        if (Boolean.TRUE.equals(user.getBlocked())) {
            return false;
        }

        return encoder.matches(password, user.getPassword());
    }

    // ---------------- GET USER ----------------
    public User getUser(String email) {
        return userRepository.findByEmail(email);
    }

    // ---------------- CHECK EMAIL EXISTS ----------------
    public boolean emailExists(String email) {
        return userRepository.findByEmail(email) != null;
    }
}
