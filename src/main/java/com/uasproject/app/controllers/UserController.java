package com.uasproject.app.controllers;

import java.util.Map;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.uasproject.app.Dto.ProfileEditRequestDto;
import com.uasproject.app.Dto.UpdatePasswordRequest;
import com.uasproject.app.Dto.UserRequestFollowDto;
import com.uasproject.app.entity.User;
import com.uasproject.app.services.StatisticService;
import com.uasproject.app.services.UserService;

@RestController
public class UserController {
    @Autowired
    private StatisticService statisticService;
    @Autowired
    private UserService userService;

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

    @PostMapping("/api/v1/follow")
    public ResponseEntity<?> follow(
            @AuthenticationPrincipal User user,
            @RequestBody UserRequestFollowDto userRequestFollowDto) {
        return ResponseEntity.ok("OK!");
    }
}
