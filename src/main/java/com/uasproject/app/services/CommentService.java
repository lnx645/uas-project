package com.uasproject.app.services;
import com.uasproject.app.Dto.CommentResponseDTO;
import com.uasproject.app.entity.PostComments;
import com.uasproject.app.entity.Posts;
import com.uasproject.app.entity.User;
import com.uasproject.app.repository.PostCommentsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final PostCommentsRepository commentRepository;

    @Transactional(readOnly = true)
    public List<CommentResponseDTO> getCommentsTreeByPostId(Long postId) {
        // 1. Ambil data asli dari database
        List<PostComments> allComments = commentRepository.findByPostId(postId);

        // 2. Susun secara otomatis menjadi struktur pohon percakapan
        return allComments.stream()
                .filter(comment -> comment.getParentComment() == null)
                .map(comment -> convertToDTO(comment, allComments))
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentResponseDTO createComment(Long postId, String content, Long parentId, User currentUser) {
        // Buat relasi objek Post untuk dimasukkan ke kolom post_id
        Posts post = Posts.builder().id(postId).build();
        
        // Cari data komentar induk jika ini merupakan sebuah balasan (reply)
        PostComments parentComment = null;
        if (parentId != null) {
            parentComment = commentRepository.findById(parentId).orElse(null);
        }

        // 1. Simpan entity asli ke tabel post_comments
        PostComments comment = PostComments.builder()
                .content(content)
                .post(post)
                .author(currentUser)
                .parentComment(parentComment)
                .likesCount(0)
                .isBestAnswer(false)
                .build();

        PostComments savedComment = commentRepository.save(comment);

        // 2. Kembalikan data DTO asli hasil insert database ke frontend React
        return CommentResponseDTO.builder()
                .id(savedComment.getId())
                .authorName(savedComment.getAuthor().getName())
                .text(savedComment.getContent())
                .timeAgo("Baru saja")
                .replies(new ArrayList<>())
                .build();
    }

    private CommentResponseDTO convertToDTO(PostComments comment, List<PostComments> allComments) {
        List<CommentResponseDTO> replies = allComments.stream()
                .filter(c -> c.getParentComment() != null && c.getParentComment().getId().equals(comment.getId()))
                .map(c -> convertToDTO(c, allComments))
                .collect(Collectors.toList());

        return CommentResponseDTO.builder()
                .id(comment.getId())
                .authorName(comment.getAuthor() != null ? comment.getAuthor().getName() : "Anonymous")
                .text(comment.getContent())
                .timeAgo("2d") 
                .replies(replies)
                .build();
    }
}