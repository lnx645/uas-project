package com.uasproject.app.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.uasproject.app.entity.PostLikes;
import com.uasproject.app.entity.Posts;
import com.uasproject.app.entity.User;

@Repository
public interface PostLikeRepository extends JpaRepository<PostLikes, Long> {
    Optional<PostLikes> findByPostAndUser(Posts post, User user);

    List<PostLikes> findByPost(Posts post);

    @Query(value = "SELECT COUNT(*) FROM post_likes WHERE user_id = :userId AND post_id = :postId", nativeQuery = true)
    int isUserLikingPost(@Param("userId") Long userId, @Param("postId") Long postId);
}
