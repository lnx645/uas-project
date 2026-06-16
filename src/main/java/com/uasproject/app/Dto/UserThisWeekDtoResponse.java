package com.uasproject.app.Dto;

import java.time.Duration;
import java.time.Instant;

import com.uasproject.app.entity.User;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserThisWeekDtoResponse {
    private String name;
    private String avatarUrl;
    private long points;
    private Boolean isOnline;
    private String kredensial;

    public UserThisWeekDtoResponse(User user) {
        this.setName(user.getName());
        this.setAvatarUrl(user.getAvatar_url());
        this.setPoints(user.getPoints());
        this.setKredensial(user.getKredensial());
        if (user.getLastActive() != null) {
            long secondsPassed = Duration.between(user.getLastActive(), Instant.now()).toSeconds();
            this.isOnline = secondsPassed <= 60;
        } else {
            this.setIsOnline(false);
        }
    }
}
