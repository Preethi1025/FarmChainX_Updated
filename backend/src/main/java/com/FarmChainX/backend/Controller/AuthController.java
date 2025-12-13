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

    // ---------------- REGISTER ----------------
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User saved = authService.register(user);
            saved.setPassword(null);

            return ResponseEntity.ok(Map.of(
                    "message", "Registration successful",
                    "user", saved
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ---------------- LOGIN ----------------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {

        User user = authService.getUser(loginRequest.getEmail());

        if (user == null) {
            return ResponseEntity
                    .status(401)
                    .body(Map.of("error", "User not found"));
        }

        if (Boolean.TRUE.equals(user.getBlocked())) {
            return ResponseEntity
                    .status(403)
                    .body(Map.of("error", "User is blocked"));
        }

        boolean success = authService.login(
                loginRequest.getEmail(),
                loginRequest.getPassword()
        );

        if (!success) {
            return ResponseEntity
                    .status(401)
                    .body(Map.of("error", "Invalid password"));
        }

        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    // ---------------- CHECK EMAIL EXISTS (LIVE VALIDATION) ----------------
    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        boolean exists = authService.emailExists(email);
        return ResponseEntity.ok(Map.of("exists", exists));
    }
}
