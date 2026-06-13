package com.uasproject.app.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.uasproject.app.Dto.LoginRequestApi;
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
        this.authService.login(requestApi);
        return ResponseEntity.ok("WKKW: "+requestApi.getEmail());
    }
}
