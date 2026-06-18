package com.uasproject.app.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.uasproject.app.Dto.ProfileEditRequestDto;
import com.uasproject.app.Dto.UpdatePasswordRequest;
import com.uasproject.app.entity.User;
import com.uasproject.app.exception.ResourceNotFoundException;
import com.uasproject.app.services.FollowerService;
import com.uasproject.app.services.StatisticService;
import com.uasproject.app.services.UserService;

@RestController
public class UserController {
    @Autowired
    private StatisticService statisticService;
    @Autowired
    private UserService userService;
    @Autowired
    private FollowerService followerService;
    @GetMapping("/api/users/active")
    public ResponseEntity<?> activeUsers(@AuthenticationPrincipal User userDetails) {
        return ResponseEntity.ok(this.statisticService.activeUsers());
    }

    @GetMapping("/api/users/active_this_week")
    public ResponseEntity<?> topActiveUser(@AuthenticationPrincipal User userDetails) {
        return ResponseEntity.ok(statisticService.topActiveUser());
    }

    @PostMapping("/api/v1/user/profile/edit")
    public ResponseEntity<?> editUser(
            @AuthenticationPrincipal User user,
            @RequestBody ProfileEditRequestDto profileEditRequestDto) {
        try {
            this.userService.editUserInformation(user, profileEditRequestDto);
            return ResponseEntity.ok(Map.of("message", "Profil berhasil diperbarui!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Terjadi kesalahan pada server"));
        }
    }

    @PostMapping("/api/v1/user/profile/update-password")
    public ResponseEntity<?> updatePassword(
            @AuthenticationPrincipal User user,
            @RequestBody UpdatePasswordRequest dto) {
        try {
            this.userService.updatePassword(user, dto);
            return ResponseEntity.ok(Map.of("message", "Kata sandi berhasil diperbarui!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Gagal memperbarui kata sandi"));
        }
    }

    @PostMapping("/api/v1/users/{id}/follow")
    public ResponseEntity<?> follow(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        try {
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User belum terautentikasi");
            }

            this.followerService.follow(user, id);
            return ResponseEntity.ok("OK!");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @PostMapping("/api/v1/users/{id}/unfollow")
    public ResponseEntity<?> unfollow(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        try {
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User belum terautentikasi");
            }

            this.followerService.unfollow(user, id);
            return ResponseEntity.ok("OK!");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
