package com.uasproject.app.Dto;

import java.util.List;
import java.util.Set;

import com.uasproject.app.entity.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostLikeResponseDto {
    private String name;
    private String avatar_url;
    private Long id;
    private boolean isFollowingUser;
    private String kredensial;
    private User user;
}
