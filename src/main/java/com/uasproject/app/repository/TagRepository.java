package com.uasproject.app.repository;

import org.springframework.stereotype.Repository;

import com.uasproject.app.entity.PopularTags;
import com.uasproject.app.entity.Posts;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface TagRepository extends JpaRepository<PopularTags,Long> {
      Optional<Posts> findById(String id);
      Optional<PopularTags> findByName(String name);
}
