package com.uasproject.app.controllers;

import java.time.Duration;
import java.time.Instant;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uasproject.app.entity.User;
import com.uasproject.app.services.StatisticService;

@RestController
public class UserController {
    @Autowired
    private StatisticService statisticService;

    @GetMapping("/api/users/active")
    public ResponseEntity<?> activeUsers(@AuthenticationPrincipal User userDetails) {
        return ResponseEntity.ok(this.statisticService.activeUsers());
    }

    @GetMapping("/api/users/active_this_week")
    public ResponseEntity<?> topActiveUser(@AuthenticationPrincipal User userDetails) {
        return ResponseEntity.ok(statisticService.topActiveUser());
    }
}
