package com.uasproject.app.controllers;

import com.uasproject.app.Dto.CommentResponseDTO;
import com.uasproject.app.entity.PostComments;
import com.uasproject.app.entity.Posts;
import com.uasproject.app.entity.User;
import com.uasproject.app.repository.PostCommentsRepository;
import com.uasproject.app.repository.PostRepository;
import com.uasproject.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CommentController {

    private final PostCommentsRepository commentRepository;
    private final PostRepository postsRepository; 
    private final UserRepository userRepository;
    
    // 🔥 SUNTIKKAN MESSAGING TEMPLATE UNTUK BROADCAST WEBSOCKET STOMP
    private final SimpMessagingTemplate messagingTemplate;

    // 📡 1. GET UTAMA: Hanya mengambil ROOT comments (parent == null), ANTI LAG!
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentResponseDTO>> getCommentsByPost(@PathVariable Long postId) {
        List<PostComments> allComments = commentRepository.findByPostId(postId);

        List<CommentResponseDTO> rootComments = allComments.stream()
                .filter(c -> c.getParentComment() == null)
                .map(c -> convertToSimpleDTO(c, allComments))
                .collect(Collectors.toList());

        return ResponseEntity.ok(rootComments);
    }

    // 📡 2. ENDPOINT BARU: Fetch replies hanya ketika tombol "Lihat Balasan" diklik di frontend
    @GetMapping("/{commentId}/replies")
    public ResponseEntity<List<CommentResponseDTO>> getRepliesByComment(@PathVariable Long commentId) {
        List<PostComments> allComments = commentRepository.findAll(); 

        List<CommentResponseDTO> replies = allComments.stream()
                .filter(c -> c.getParentComment() != null && c.getParentComment().getId().equals(commentId))
                .map(c -> convertToSimpleDTO(c, allComments))
                .collect(Collectors.toList());

        return ResponseEntity.ok(replies);
    }

    // 📡 3. POST: Menyimpan komentar baru + Tambah Poin + Broadcast Real-time
    @PostMapping("/post/{postId}")
    public ResponseEntity<CommentResponseDTO> createComment(
            @PathVariable Long postId,
            @RequestBody Map<String, Object> payload) {

        String content = (String) payload.get("text");
        Long parentId = payload.get("parentId") != null ? Long.valueOf(payload.get("parentId").toString()) : null;

        User currentUser = getCurrentAuthenticatedUser();
        Posts post = postsRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post tidak ditemukan!"));

        PostComments parentComment = null;
        if (parentId != null) {
            parentComment = commentRepository.findById(parentId).orElse(null);
        }

        PostComments comment = PostComments.builder()
                .content(content)
                .post(post)
                .author(currentUser)
                .parentComment(parentComment)
                .likesCount(0)
                .isBestAnswer(false)
                .build();

        PostComments savedComment = commentRepository.save(comment);

        // Tambah poin user (+5)
        currentUser.setPoints(currentUser.getPoints() + 5);
        userRepository.save(currentUser);

        CommentResponseDTO response = CommentResponseDTO.builder()
                .id(savedComment.getId())
                .authorId(savedComment.getAuthor().getId())
                .authorName(savedComment.getAuthor().getName())
                .authorAvatarUrl(savedComment.getAuthor().getAvatar_url())
                .text(savedComment.getContent())
                .timeAgo(convertToTimeAgo(savedComment.getCreatedAt()))
                .repliesCount(0)
                .replies(new ArrayList<>())
                .build();

        messagingTemplate.convertAndSend("/topic/posts/" + postId + "/comments", response);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentResponseDTO> updateComment(@PathVariable Long commentId, @RequestBody Map<String, Object> payload) {
        String newContent = (String) payload.get("text");
        User currentUser = getCurrentAuthenticatedUser();
        PostComments comment = commentRepository.findById(commentId).orElseThrow(() -> new RuntimeException("Komentar tidak ditemukan!"));

        if (!comment.getAuthor().getId().equals(currentUser.getId())) return ResponseEntity.status(403).build();

        comment.setContent(newContent);
        PostComments updatedComment = commentRepository.save(comment);

        return ResponseEntity.ok(CommentResponseDTO.builder()
                .id(updatedComment.getId())
                .authorId(updatedComment.getAuthor().getId())
                .authorName(updatedComment.getAuthor().getName())
                .authorAvatarUrl(updatedComment.getAuthor().getAvatar_url())
                .text(updatedComment.getContent())
                .timeAgo(convertToTimeAgo(updatedComment.getCreatedAt()))
                .replies(new ArrayList<>())
                .build());
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        User currentUser = getCurrentAuthenticatedUser();
        PostComments comment = commentRepository.findById(commentId).orElseThrow(() -> new RuntimeException("Komentar tidak ditemukan!"));
        if (!comment.getAuthor().getId().equals(currentUser.getId())) return ResponseEntity.status(403).build();
        commentRepository.delete(comment);
        return ResponseEntity.ok().build();
    }

    private User getCurrentAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) return (User) principal;
        if (principal instanceof String) {
            return userRepository.findByEmail((String) principal).orElseThrow(() -> new RuntimeException("User tidak ditemukan!"));
        }
        throw new RuntimeException("Sesi tidak valid!");
    }

    private CommentResponseDTO convertToSimpleDTO(PostComments comment, List<PostComments> allComments) {
        if (comment == null) return null;

        long count = 0;
        if (allComments != null) {
            count = allComments.stream()
                    .filter(c -> c.getParentComment() != null && c.getParentComment().getId().equals(comment.getId()))
                    .count();
        }

        return CommentResponseDTO.builder()
                .id(comment.getId())
                .authorId(comment.getAuthor() != null ? comment.getAuthor().getId() : null)
                .authorName(comment.getAuthor() != null ? comment.getAuthor().getName() : "Anonymous")
                .authorAvatarUrl(comment.getAuthor() != null ? comment.getAuthor().getAvatar_url() : null)
                .text(comment.getContent())
                .timeAgo(convertToTimeAgo(comment.getCreatedAt())) 
                .repliesCount((int) count)
                .replies(new ArrayList<>()) 
                .build();
    }

    private String convertToTimeAgo(LocalDateTime createdAt) {
        if (createdAt == null) {
            return "Baru saja"; 
        }
        
        try {
            LocalDateTime now = LocalDateTime.now();
            Duration duration = Duration.between(createdAt, now);
            
            long seconds = duration.getSeconds();
            long minutes = duration.toMinutes();
            long hours = duration.toHours();
            long days = duration.toDays();

            if (seconds < 60) return "Baru saja";
            if (minutes < 60) return minutes + " mnt";
            if (hours < 24) return hours + " jam";
            if (days < 7) return days + " hari";
            
            return createdAt.getDayOfMonth() + "/" + createdAt.getMonthValue() + "/" + createdAt.getYear();
        } catch (Exception e) {
            return "Baru saja";
        }
    }
}