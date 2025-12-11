package com.FarmChainX.backend.Controller;

import com.FarmChainX.backend.Model.User;
import com.FarmChainX.backend.Service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("*")
public class AdminController {

    @Autowired
    AuthService authService;

    // ✔ Admin Registration
    @PostMapping("/register")
    public ResponseEntity<?> registerAdmin(@RequestBody User admin) {

        admin.setRole("ADMIN"); // force admin role

        User saved = authService.register(admin);

        saved.setPassword(null); // hide password
        return ResponseEntity.ok(saved);
    }

    // ✔ Admin Login
    @PostMapping("/login")
    public ResponseEntity<?> loginAdmin(@RequestBody Map<String, String> req) {

        String email = req.get("email");
        String password = req.get("password");

        User user = authService.getUser(email);

        if (user == null || !user.getRole().equals("ADMIN"))
            return ResponseEntity.status(401).body(Map.of("error", "Not an admin"));

        if (!authService.login(email, password))
            return ResponseEntity.status(401).body(Map.of("error", "Invalid password"));

        user.setPassword(null);
        return ResponseEntity.ok(user);
    }
}
