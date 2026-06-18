package com.uasproject.app.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uasproject.app.entity.User;
import com.uasproject.app.exception.ResourceNotFoundException;
import com.uasproject.app.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Service
@AllArgsConstructor
@NoArgsConstructor
public class FollowerService {
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public void follow(User authenticatedUser, Long targetUserId) {
        if (authenticatedUser.getId().equals(targetUserId)) {
            throw new IllegalArgumentException("Kamu tidak bisa mem-follow dirimu sendiri!");
        }
        if (!userRepository.existsById(targetUserId)) {
            throw new ResourceNotFoundException("User yang ingin di-follow tidak ditemukan");
        }

        try {
            userRepository.insertFollow(authenticatedUser.getId(), targetUserId);
        } catch (Exception e) {
            throw new IllegalArgumentException("Kamu sudah mem-follow user ini!");
        }
    }

    @Transactional
    public void unfollow(User authenticatedUser, Long targetUserId) {
        if (authenticatedUser.getId().equals(targetUserId)) {
            throw new IllegalArgumentException("Kamu tidak bisa meng-unfollow dirimu sendiri!");
        }

        if (!userRepository.existsById(targetUserId)) {
            throw new ResourceNotFoundException("User yang ingin di-unfollow tidak ditemukan");
        }
        userRepository.deleteFollow(authenticatedUser.getId(), targetUserId);
    }
}
