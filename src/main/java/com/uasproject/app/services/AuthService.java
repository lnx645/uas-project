package com.uasproject.app.services;
import org.springframework.security.crypto.password.PasswordEncoder;
//services
import org.springframework.stereotype.Service;

import com.uasproject.app.Dto.LoginRequestApi;
import com.uasproject.app.Dto.LoginResponseApi;
import com.uasproject.app.Dto.RegisterRequestApi;
import com.uasproject.app.entity.User;
import com.uasproject.app.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
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
        user.setTahun_angkatan(request.getTahun_angkatan());
        user.setJurusan(request.getJurusan());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
        String jwtToken = jwtService.generateToken(user.getEmail());
        return new LoginResponseApi("Berhasil", jwtToken);
    }

    public LoginResponseApi login(LoginRequestApi request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan!"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Password salah!");
        }
        String jwtToken = jwtService.generateToken(user.getEmail());
        return new LoginResponseApi("Berhasil", jwtToken);
    }

}
