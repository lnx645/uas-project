package com.uasproject.app.entity;

import java.security.AuthProvider;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
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

    @Column(name = "kredensial", nullable = true)
    private String kredensial;
    @Column(name = "avatar_url", nullable = true)
    private String avatar_url;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    private AuthProvider provider;

    @Column(name = "is_online", nullable = true)
    @Builder.Default
    private Boolean isOnline = false;

    @Column(name = "last_active", nullable = true)
    private Instant lastActive;

    @Column(name = "points", nullable = true)
    private long points;

    @Column(name = "bio", nullable = true, columnDefinition = "TEXT")
    private String bio;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_follows", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "follow_id"))
    @Builder.Default
    private Set<User> following = new HashSet<>();

    @ManyToMany(mappedBy = "following", fetch = FetchType.LAZY)
    @JsonIgnore
    @Builder.Default
    private Set<User> followers = new HashSet<>();

    @Column(name = "badge", nullable = true)
    private String badge;

    public enum AuthProvider {
        REGULAR, GOOGLE
    }

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