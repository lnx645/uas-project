package com.uasproject.app.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uasproject.app.entity.Posts;
@Repository
public interface PostRepository extends JpaRepository<Posts,Long> {
        Optional<Posts> findById(String id);

}
