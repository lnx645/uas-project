package com.uasproject.app.Dto;

import java.time.Duration;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserThisWeekDtoResponse {
    private String name;
    private String avatarUrl;
    private long points;
    private Boolean isOnline;
    private String jurusan;
    private String angkatan;
    public UserThisWeekDtoResponse(String name, String avatarUrl, long points, Instant lastActive, String jurusan, String angkatanLengkap) {
        this.name = name;
        this.avatarUrl = avatarUrl;
        this.points = points;
        this.jurusan = jurusan;

        if (lastActive != null) {
            long secondsPassed = Duration.between(lastActive, Instant.now()).toSeconds();
            this.isOnline = secondsPassed <= 60;
        } else {
            this.isOnline = false;
        }

        if (angkatanLengkap != null && angkatanLengkap.length() >= 2) {
            this.angkatan = angkatanLengkap.substring(angkatanLengkap.length() - 2);
        } else {
            this.angkatan = angkatanLengkap;
        }
    }
}
