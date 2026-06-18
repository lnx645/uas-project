package com.uasproject.app.services;

import java.util.Set;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.uasproject.app.Dto.ProfileEditRequestDto;
import com.uasproject.app.Dto.UpdatePasswordRequest;
import com.uasproject.app.entity.User;
import com.uasproject.app.entity.User.AuthProvider;
import com.uasproject.app.exception.ResourceNotFoundException;
import com.uasproject.app.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserService {
    private UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void editUserInformation(User user, ProfileEditRequestDto profileEditRequestDto) {
        this.userRepository
                .findByEmail(profileEditRequestDto.getEmail())
                .ifPresent(existingUser -> {
                    if (!existingUser.getId().equals(user.getId())) {
                        throw new IllegalArgumentException("Email sudah digunakan oleh orang lain!");
                    }
                });

        user.setEmail(profileEditRequestDto.getEmail());
        user.setName(profileEditRequestDto.getName());
        user.setBio(profileEditRequestDto.getBio());
        user.setKredensial(profileEditRequestDto.getCredential());
        this.userRepository.save(user);
    }

    public void updatePassword(User user, UpdatePasswordRequest dto) {
        if (user.getPassword() != null) {
            if (!passwordEncoder.matches(dto.getOldPassword(), user.getPassword())) {
                throw new IllegalArgumentException("Kata sandi lama salah!");
            }
        }

        if (passwordEncoder.matches(dto.getNewPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Kata Sandi tidak boleh sama dengan yang sebelumnya!");

        }

        if (dto.getNewPassword().length() < 8) {
            throw new IllegalArgumentException("Kata sandi baru minimal harus 8 karakter!");
        }

        String encryptedPassword = passwordEncoder.encode(dto.getNewPassword());
        user.setPassword(encryptedPassword);
        this.userRepository.save(user);
    }

 
}
