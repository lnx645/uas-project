package com.uasproject.app.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uasproject.app.entity.User;

@RestController
public class PostController {
    @GetMapping("/api/threads")
    public ResponseEntity<?> getThreads(@AuthenticationPrincipal User userDetails) {
        return ResponseEntity.ok("Berhasl"+userDetails.getId());
    }
    
}
