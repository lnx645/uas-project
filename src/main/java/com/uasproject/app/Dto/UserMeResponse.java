package com.uasproject.app.Dto;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import com.uasproject.app.entity.User;

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
    private String bio;
    private boolean isOnline;
    private String badge;
    private User userDetails;
    private long points;

    private Set<String> tags;

    public UserMeResponse(User userDetails) {
        this.id = userDetails.getId();
        this.name = userDetails.getName();
        this.email = userDetails.getEmail();
        this.username = userDetails.getUsername();
        this.avatarUrl = userDetails.getAvatar_url();
        this.badge = userDetails.getBadge();
        this.lastActive = userDetails.getLastActive();
        this.bio = userDetails.getBio();
        this.points = userDetails.getPoints();
        this.tags = new HashSet<>();
        this.tags.add(userDetails.getJurusan());
        this.tags.add(userDetails.getTahun_angkatan());

        LocalDateTime tanggalJoinDateTime = userDetails.getCreatedAt();

        if (tanggalJoinDateTime != null) {
            LocalDateTime sekarang = LocalDateTime.now();
            String textWaktuJoin;

            long tahun = ChronoUnit.YEARS.between(tanggalJoinDateTime, sekarang);
            long bulan = ChronoUnit.MONTHS.between(tanggalJoinDateTime, sekarang);
            long hari = ChronoUnit.DAYS.between(tanggalJoinDateTime, sekarang);

            if (tahun > 0) {
                textWaktuJoin = tahun + " tahun yang lalu";
            } else if (bulan > 0) {
                textWaktuJoin = bulan + " bulan yang lalu";
            } else if (hari > 0) {
                textWaktuJoin = hari + " hari yang lalu";
            } else {
                long jam = ChronoUnit.HOURS.between(tanggalJoinDateTime, sekarang);
                if (jam > 0) {
                    textWaktuJoin = jam + " jam yang lalu";
                } else {
                    textWaktuJoin = "Baru saja";
                }
            }
            this.tags.add("Join "+textWaktuJoin);
        }

        // Tag lainnya tetap aman
        this.tags.add(userDetails.getJurusan());
        this.tags.add(userDetails.getTahun_angkatan());

        if (lastActive != null) {
            long secondsPassed = Duration.between(lastActive, Instant.now()).toSeconds();
            this.isOnline = secondsPassed <= 60;
        } else {
            this.isOnline = false;
        }

    }

}