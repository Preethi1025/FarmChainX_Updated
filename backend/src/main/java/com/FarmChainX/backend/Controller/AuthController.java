package com.FarmChainX.backend.Controller;

import com.FarmChainX.backend.Model.User;
import com.FarmChainX.backend.Service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        authService.register(user);
        return "Registration Successful!";
    }

   @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody User loginRequest) {

    User user = authService.getUser(loginRequest.getEmail());

    if (user == null) {
        return ResponseEntity.status(401).body(Map.of("error", "User not found"));
    }

    boolean success = authService.login(loginRequest.getEmail(), loginRequest.getPassword());

    if (!success) {
        return ResponseEntity.status(401).body(Map.of("error", "Invalid password"));
    }

    // Return user data except password
    user.setPassword(null);
    return ResponseEntity.ok(user);
}
}
