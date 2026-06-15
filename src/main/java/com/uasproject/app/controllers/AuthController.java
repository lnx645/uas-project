package com.uasproject.app.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.uasproject.app.Dto.GoogleLoginRequest;
import com.uasproject.app.Dto.LoginRequestApi;
import com.uasproject.app.Dto.RegisterRequestApi;
import com.uasproject.app.Dto.UserMeResponse;
import com.uasproject.app.entity.User;
import com.uasproject.app.services.AuthService;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
public class AuthController {
    @Autowired
    private AuthService authService;

    @Tag(name = "Auth Login", description = "Endpoint untuk melakukan prosess")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(required = true)
    @PostMapping("/api/auth/login")
    public ResponseEntity<?> main(@RequestBody LoginRequestApi requestApi) {
        try {
            return ResponseEntity.ok(authService.login(requestApi));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/api/auth/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestApi lApi) {

        try {
            return ResponseEntity.ok(this.authService.register(lApi));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));

        }

    }

    @PostMapping("/api/auth/google")
    public ResponseEntity<?> signWithGoogle(@RequestBody GoogleLoginRequest googleLoginRequest) {
        try {
            String jwttoken = this.authService.loginWithGoogle(googleLoginRequest.getIdToken());
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login Google Berhasil");
            response.put("token", jwttoken);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));

        }

    }

    @GetMapping("/api/v1/me")
    public ResponseEntity<?> getUser(@AuthenticationPrincipal User userDetails) {
        UserMeResponse response = new UserMeResponse(
                userDetails.getId(),
                userDetails.getName(),
                userDetails.getEmail(),
                userDetails.getUsername(),
                userDetails.getAvatar_url(),
                userDetails.getLastActive()
        );

        return ResponseEntity.ok(response);
    }
}
