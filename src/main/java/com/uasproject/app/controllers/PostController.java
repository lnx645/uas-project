package com.uasproject.app.controllers;

import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.uasproject.app.Dto.CreatePostRequest;
import com.uasproject.app.Dto.VoteRequestDto;
import com.uasproject.app.entity.User;
import com.uasproject.app.repository.PostLikeRepository;
import com.uasproject.app.repository.UserRepository;
import com.uasproject.app.services.PostService;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
public class PostController {

    private PostService postService;
    private PostLikeRepository postLikeRepository;
    private UserRepository userRepository;

    @GetMapping("/api/threads")
    public ResponseEntity<?> getThreads(@AuthenticationPrincipal User userDetails) {
        return ResponseEntity.ok("Berhasl" + userDetails.getId());
    }

    @GetMapping("/api/v1/profile/posts")
    public ResponseEntity<?> getProfilePost(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(user);
    }

    @PostMapping("/api/v1/post/create")
    public ResponseEntity<?> createPost(@AuthenticationPrincipal User user, @RequestBody CreatePostRequest post) {
        try {
            this.postService.createPost(user, post);
            return ResponseEntity.ok(Map.of("message", "Berhasil menambahkan postingan!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/api/popular-tags")
    public ResponseEntity<?> getPopularTag() {
        try {
            return ResponseEntity.ok(this.postService.getPopularTags());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/api/posts")

    public ResponseEntity<?> getPost() {
        return ResponseEntity.ok(this.postService.getAllPost());
    }

    @PostMapping("/api/post/vote")
    public ResponseEntity<?> vote(@RequestBody VoteRequestDto voteRequestDto) {
        User currentUser = getCurrentAuthenticatedUser();
        if (this.postService.addLikes(voteRequestDto, currentUser)) {
            return ResponseEntity.ok(true);
        }
        return ResponseEntity.ok(false);
    }

    @GetMapping("/api/post/like/users/{id}")
    public ResponseEntity<?> getPostVote(@PathVariable Long id) {
        return ResponseEntity.ok(this.postService.getPostUserLike(id));
    }

    private User getCurrentAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User)
            return (User) principal;
        if (principal instanceof String) {
            return userRepository.findByEmail((String) principal)
                    .orElseThrow(() -> new RuntimeException("User tidak ditemukan!"));
        }
        throw new RuntimeException("Sesi tidak valid!");
    }

}
