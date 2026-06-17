package com.uasproject.app.services;

import java.util.HashSet;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import com.uasproject.app.Dto.CreatePostRequest;
import com.uasproject.app.entity.PopularTags;
import com.uasproject.app.entity.Posts;
import com.uasproject.app.entity.User;
import com.uasproject.app.entity.Posts.PostType;
import com.uasproject.app.repository.PostRepository;
import com.uasproject.app.repository.TagRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class PostService {
    private PostRepository postRepository;
    private TagRepository tagRepository;

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

    public void createPost(User user, CreatePostRequest postRequest) {

        PostType type = "create-post".equalsIgnoreCase(postRequest.getIntent())
                ? PostType.POST
                : PostType.QUESTION;
        Set<String> extractedTags = new HashSet<>();
        Posts posts = new Posts();
        if (type == PostType.POST) {
            posts.setContent(postRequest.getContent());
            extractedTags = this.extractTags(postRequest.getContent());

        }

        if (type == PostType.QUESTION) {
            posts.setTitle(postRequest.getTitle());
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
                        newTag.setTotalPost(1);
                        return this.tagRepository.save(newTag);
                    });

            postTags.add(tag);
        }
        posts.setTags(postTags);
        posts.setPostType(type);
        this.postRepository.save(posts);
    }
}
