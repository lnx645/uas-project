package com.uasproject.app.Dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponseDTO {
    private Long id;
    private String authorName;
    private String text;
    private String authorAvatarUrl;
    private Long authorId;
    private String timeAgo;
    private List<CommentResponseDTO> replies;
    private int repliesCount;
}