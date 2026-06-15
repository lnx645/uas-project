package com.uasproject.app.Dto;

import java.time.Duration;
import java.time.Instant;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserMeResponse {
    private Long id;
    private String name;
    private String email;
    private String username;
    private String avatarUrl;
    private Instant lastActive;
    private boolean isOnline;
    public UserMeResponse(Long id, String name, String email, String username, String avatarUrl, Instant lastActive) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.username = username;
        this.avatarUrl = avatarUrl;
        this.lastActive = lastActive;
        if (lastActive != null) {
            long secondsPassed = Duration.between(lastActive, Instant.now()).toSeconds();
            this.isOnline = secondsPassed <= 60;
        } else {
            this.isOnline = false;
        }
    }

}