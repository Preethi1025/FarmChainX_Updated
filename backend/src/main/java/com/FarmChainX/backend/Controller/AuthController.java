package com.FarmChainX.backend.Controller;

import com.FarmChainX.backend.Model.User;
import com.FarmChainX.backend.Service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        authService.register(user);
        return "Registration Successful!";
    }

    @PostMapping("/login")
    public Object login(@RequestBody User loginRequest) {

        boolean success = authService.login(loginRequest.getEmail(), loginRequest.getPassword());

        if (success) {
            return authService.getUser(loginRequest.getEmail());
        } else {
            return "Invalid email or password!";
        }
    }
}
