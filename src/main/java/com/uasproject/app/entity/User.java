package com.uasproject.app.entity;

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
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Otomatis mengisi waktu created_at saat user pertama kali register
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // --- PERBAIKAN METHOD IMPLEMENTASI USERDETAILS ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Karena forum sederhana belum butuh Role bertingkat (Admin/User),
        // kita kembalikan list kosong saja agar tidak memicu error.
        return List.of();
    }

    @Override
    public String getUsername() {
        // PENTING: Karena sistem login kita berbasis EMAIL, 
        // method getUsername() harus mengembalikan nilai dari property email!
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Ubah ke true agar akun tidak dianggap kedaluwarsa
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Ubah ke true agar akun tidak dalam kondisi terkunci
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Ubah ke true agar kredensial/password tidak kedaluwarsa
    }

    @Override
    public boolean isEnabled() {
        return true; // Ubah ke true agar akun langsung aktif setelah dibuat
    }
}