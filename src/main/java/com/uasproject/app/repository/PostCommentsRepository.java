package com.uasproject.app.repository;

import com.uasproject.app.entity.PostComments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostCommentsRepository extends JpaRepository<PostComments, Long> {
    // Mengambil semua komentar berdasarkan ID Post untuk disusun menjadi Tree di Service
    List<PostComments> findByPostId(Long postId);
}