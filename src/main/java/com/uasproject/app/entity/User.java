package com.uasproject.app.entity;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "email", nullable = false, length = 100, unique = true)
    private String email;

    @Column(name = "password", nullable = false, length = 225)
    private String password;

    @Column(name = "tahun_angkatan", nullable = true)
    private String tahun_angkatan;

    @Column(name = "jurusan", nullable = true)
    private String jurusan;

    @Column(name = "avatar_url", nullable = true)
    private String avatar_url;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "is_online",nullable = true)
    private Boolean isOnline = false;

    @Column(name = "last_active",nullable = true)
    private Instant lastActive;

    @Column(name = "points",nullable = true)
    private long points;

    @Column(name = "bio",nullable = true,columnDefinition = "TEXT")
    private String bio;

    @Column(name = "badge",nullable = true)
    private String badge;

    
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
    

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; 
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}