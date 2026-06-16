package com.uasproject.app.services;

import java.time.Instant;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import com.uasproject.app.Dto.LoginRequestApi;
import com.uasproject.app.Dto.LoginResponseApi;
import com.uasproject.app.Dto.RegisterRequestApi;
import com.uasproject.app.entity.User;
import com.uasproject.app.entity.User.AuthProvider;
import com.uasproject.app.repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginResponseApi register(RegisterRequestApi request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email sudah terdaftar!");
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setProvider(AuthProvider.REGULAR);
        userRepository.save(user);

        String jwtToken = jwtService.generateToken(user.getEmail());
        return new LoginResponseApi("Berhasil", jwtToken, user.getName(), user.getEmail());
    }

    public LoginResponseApi login(LoginRequestApi request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan!"));
        user.setLastActive(Instant.now());
        user.setProvider(AuthProvider.REGULAR);

        userRepository.save(user);
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Password salah!");
        }
        String jwtToken = jwtService.generateToken(user.getEmail());
        return new LoginResponseApi("Berhasil", jwtToken, user.getName(), user.getEmail());
    }

    public String loginWithGoogle(String accessTokenString) {
        try {
            String cleanToken = accessTokenString.trim();

            String url = UriComponentsBuilder.fromUriString("https://www.googleapis.com/userinfo/v2/me")
                    .queryParam("access_token", cleanToken)
                    .toUriString();

            org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
            java.util.Map<?, ?> response = restTemplate.getForObject(url, java.util.Map.class);

            if (response == null || response.containsKey("error")) {
                throw new RuntimeException("Access Token Google tidak valid atau kedaluwarsa!");
            }

            String email = (String) response.get("email");
            String name = (String) response.get("name");
            String avatar_url = (String) response.get("picture");

            if (email == null) {
                throw new RuntimeException("Gagal mendapatkan email dari Google User Info!");
            }
            Optional<User> userOptional = userRepository.findByEmail(email);
            User user;

            if (userOptional.isEmpty()) {
                user = new User();
                user.setEmail(email);
                user.setProvider(AuthProvider.GOOGLE);
                user.setName(name);
                user.setPoints(0);
                user.setAvatar_url(avatar_url);
                user.setPassword("");
                user.setLastActive(Instant.now());
                userRepository.save(user);
            } else {
                user = userOptional.get();
            }
            return jwtService.generateToken(user.getEmail());

        } catch (Exception e) {
            throw new RuntimeException("Gagal autentikasi via Google User Info: " + e.getMessage());
        }
    }
}