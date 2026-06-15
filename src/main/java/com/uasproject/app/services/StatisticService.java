package com.uasproject.app.services;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uasproject.app.Dto.UserMeResponse;
import com.uasproject.app.Dto.UserThisWeekDtoResponse;
import com.uasproject.app.repository.UserRepository;

@Service
public class StatisticService {
    @Autowired
    private UserRepository userRepository;

    public List<UserMeResponse> activeUsers() {
        List<UserMeResponse> activeUsers = this.userRepository.findAll().stream().map(user -> new UserMeResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getUsername(),
                user.getAvatar_url(),
                user.getLastActive())).filter(UserMeResponse::isOnline)
                .collect(Collectors.toList());
        return activeUsers;
    }

    public List<UserThisWeekDtoResponse> topActiveUser() {
        List<UserThisWeekDtoResponse> data = this.userRepository.findAll().stream()
                .map(user -> new UserThisWeekDtoResponse(
                        user.getName(),
                        user.getAvatar_url(),
                        user.getPoints(),
                        user.getLastActive(),
                        user.getJurusan(),
                        user.getTahun_angkatan()))
                .sorted(Comparator.comparing(UserThisWeekDtoResponse::getPoints).reversed())
                .collect(Collectors.toList());
        return data;
    }
}
