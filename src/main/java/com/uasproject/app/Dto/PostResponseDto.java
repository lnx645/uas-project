package com.uasproject.app.Dto;

import java.time.LocalDateTime;
import java.util.Set;

import com.uasproject.app.entity.Posts.PostType;
import com.uasproject.app.entity.Posts.PostVisibility;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class PostResponseDto {
    private Long id;
    private PostType postType;
    private String title;
    private String content;
    private String slug;
    private PostVisibility visibility;
    private Boolean isAnonymous;
    
    private String authorName;
    private String authorAvatarUrl;
    private Integer likesCount;
    private Integer repliesCount;
    private Integer viewsCount;
    private String facultyTag;
    private Set<String> tags; 
    private LocalDateTime createdAt;
}
