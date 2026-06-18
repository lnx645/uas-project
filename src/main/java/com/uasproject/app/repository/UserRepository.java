package com.uasproject.app.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.uasproject.app.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Modifying
    @Query(value = "INSERT INTO user_follows (user_id, follow_id) VALUES (:currentUserId, :targetUserId)", nativeQuery = true)
    void insertFollow(@Param("currentUserId") Long currentUserId, @Param("targetUserId") Long targetUserId);

    @Modifying
    @Query(value = "DELETE FROM user_follows WHERE user_id = :currentUserId AND follow_id = :targetUserId", nativeQuery = true)
    void deleteFollow(@Param("currentUserId") Long currentUserId, @Param("targetUserId") Long targetUserId);

    @Query(value = "SELECT COUNT(*) FROM user_follows WHERE user_id = :currentUserId AND follow_id = :targetUserId", nativeQuery = true)
    int isUserFollowingTarget(@Param("currentUserId") Long currentUserId, @Param("targetUserId") Long targetUserId);
}