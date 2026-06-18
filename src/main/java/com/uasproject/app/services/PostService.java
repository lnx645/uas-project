package com.uasproject.app.services;

import java.text.Normalizer;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.uasproject.app.Dto.CreatePostRequest;
import com.uasproject.app.Dto.PostLikeResponseDto;
import com.uasproject.app.Dto.PostResponseDto;
import com.uasproject.app.Dto.VoteRequestDto;
import com.uasproject.app.entity.PopularTags;
import com.uasproject.app.entity.PostLikes;
import com.uasproject.app.entity.Posts;
import com.uasproject.app.entity.User;
import com.uasproject.app.entity.Posts.PostType;
import com.uasproject.app.exception.ResourceNotFoundException;
import com.uasproject.app.repository.PostLikeRepository;
import com.uasproject.app.repository.PostRepository;
import com.uasproject.app.repository.TagRepository;
import com.uasproject.app.repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class PostService {
    private PostRepository postRepository;
    private TagRepository tagRepository;
    private PostLikeRepository postLikeRepository;
    private UserRepository userRepository;

    private Set<String> extractTags(String text) {
        Set<String> tags = new HashSet<>();
        if (text == null || text.isEmpty()) {
            return tags;
        }
        Pattern pattern = Pattern.compile("#(\\w+)");
        Matcher matcher = pattern.matcher(text);

        while (matcher.find()) {
            tags.add(matcher.group(1).toLowerCase());
        }

        return tags;
    }

    public String generateUuidSlug(String title) {
        if (title == null || title.trim().isEmpty()) {
            return "untitled-" + UUID.randomUUID().toString().substring(0, 8);
        }
        String cleanedTitle = title.trim();
        String[] words = cleanedTitle.split("\\s+");

        if (words.length > 25) {
            StringBuilder shortTitle = new StringBuilder();
            for (int i = 0; i < 25; i++) {
                shortTitle.append(words[i]).append(" ");
            }
            cleanedTitle = shortTitle.toString().trim();
        }

        String baseSlug = cleanedTitle.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("[\\s-]+", "-");
        String randomCode = UUID.randomUUID().toString().substring(0, 8);

        return baseSlug + "-" + randomCode;
    }

    public void createPost(User user, CreatePostRequest postRequest) {

        PostType type = "create-post".equalsIgnoreCase(postRequest.getIntent())
                ? PostType.POST
                : PostType.QUESTION;
        Set<String> extractedTags = new HashSet<>();
        Posts posts = new Posts();
        if (type == PostType.POST) {
            posts.setContent(postRequest.getContent());
            extractedTags = this.extractTags(postRequest.getContent());
            posts.setSlug(this.generateUuidSlug(postRequest.getContent()));

        }

        if (type == PostType.QUESTION) {
            posts.setTitle(postRequest.getTitle());
            posts.setSlug(this.generateUuidSlug(postRequest.getTitle()));

            extractedTags = this.extractTags(postRequest.getTitle());
        }
        posts.setIsAnonymous(postRequest.getIsAnonymous());
        "FOLLOWERS".equalsIgnoreCase(postRequest.getVisibility());
        posts.setAuthor(user);
        Set<PopularTags> postTags = new HashSet<>();
        for (String tagName : extractedTags) {
            PopularTags tag = this.tagRepository.findByName(tagName)
                    .map(existingTag -> {
                        existingTag.setTotalPost(existingTag.getTotalPost() + 1);
                        return existingTag;
                    })
                    .orElseGet(() -> {
                        PopularTags newTag = new PopularTags();
                        newTag.setName(tagName);
                        newTag.setSlug(this.makeSlug(tagName));
                        newTag.setTotalPost(1);
                        return this.tagRepository.save(newTag);
                    });

            postTags.add(tag);
        }
        posts.setTags(postTags);
        posts.setPostType(type);
        this.postRepository.save(posts);
    }

    private String makeSlug(String input) {
        if (input == null || input.isEmpty()) {
            return "";
        }
        String whistleblower = input.trim().toLowerCase(Locale.ENGLISH);
        String normalized = Normalizer.normalize(whistleblower, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        String intermediate = pattern.matcher(normalized).replaceAll("");
        String noSpecialChars = intermediate.replaceAll("[^a-z0-9\\s-]", "");
        return noSpecialChars.replaceAll("[\\s-]+", "-");
    }

    // utilitas
    private PostResponseDto convertToResponseDto(Posts post) {
        PostResponseDto.PostResponseDtoBuilder builder = PostResponseDto.builder()
                .id(post.getId())
                .postType(post.getPostType())
                .title(post.getTitle())
                .content(post.getContent())
                .slug(post.getSlug())
                .visibility(post.getVisibility())
                .isAnonymous(post.getIsAnonymous())
                .likesCount(post.getLikesCount())
                .repliesCount(post.getRepliesCount())
                .viewsCount(post.getViewsCount())
                .facultyTag(post.getFacultyTag())
                .createdAt(post.getCreatedAt());

        if (post.getIsAnonymous()) {
            builder.authorName("Pengguna Anonim");
            builder.authorAvatarUrl(null);
        } else {
            builder.authorName(post.getAuthor().getName());
            builder.authorAvatarUrl(post.getAuthor().getAvatar_url());
        }

        if (post.getTags() != null) {
            Set<String> tagNames = post.getTags().stream()
                    .map(PopularTags::getName)
                    .collect(Collectors.toSet());
            builder.tags(tagNames);
        }

        return builder.build();
    }

    // mendapatkan populer tag
    public List<PopularTags> getPopularTags() {

        try {
            return this.tagRepository.findAll().stream()
                    .filter(tag -> tag.getName() != null && !tag.getName().isEmpty())
                    .sorted(Comparator.comparing(PopularTags::getTotalPost).reversed())
                    .limit(10)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            throw e;
        }

    }

    // untuk get all post
    public List<PostResponseDto> getAllPost() {
        List<Posts> allPosts = this.postRepository.findAllByOrderByCreatedAtDesc();
        return allPosts.stream().map(this::convertToResponseDto).collect(Collectors.toList());
    }

    public boolean addLikes(VoteRequestDto id, User user) {
        Posts post = this.postRepository.findById(id.getPostId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Post dengan ID " + id.getPostId() + " tidak ditemukan."));
        Optional<PostLikes> existingLike = this.postLikeRepository.findByPostAndUser(post, user);
        if (existingLike.isPresent()) {
            this.postLikeRepository.delete(existingLike.get());
            int currentLikes = post.getLikesCount() != null ? post.getLikesCount() : 0;
            post.setLikesCount(Math.max(0, currentLikes - 1));
            this.postRepository.save(post);
            return false;

        } else {
            PostLikes newLike = PostLikes.builder().user(user).post(post).build();
            this.postLikeRepository.save(newLike);
            int currentLikes = post.getLikesCount() != null ? post.getLikesCount() : 0;
            post.setLikesCount(currentLikes + 1);

            this.postRepository.save(post);
            return true;
        }
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<PostLikeResponseDto> getPostUserLike(Long id, User authenticatedUser) {
        Posts post = this.postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post dengan ID " + id + " tidak ditemukan."));

        List<PostLikes> postLikes = this.postLikeRepository.findByPost(post);

        return postLikes.stream().map(like -> {
            User userWhoLiked = like.getUser();

            boolean isCurrentIdFollowing = false;

            if (authenticatedUser != null) {
                int count = userRepository.isUserFollowingTarget(authenticatedUser.getId(), userWhoLiked.getId());
                isCurrentIdFollowing = (count == 1);
            }

            return PostLikeResponseDto.builder()
                    .id(userWhoLiked.getId())
                    .avatar_url(userWhoLiked.getAvatar_url())
                    .isFollowingUser(isCurrentIdFollowing)
                    .name(userWhoLiked.getName())
                    .kredensial(userWhoLiked.getKredensial())
                    .build();
        }).toList();
    }

}
