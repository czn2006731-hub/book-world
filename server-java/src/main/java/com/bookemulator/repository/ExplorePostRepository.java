package com.bookemulator.repository;

import com.bookemulator.entity.ExplorePost;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExplorePostRepository extends JpaRepository<ExplorePost, Long> {
    List<ExplorePost> findAllByOrderByCreatedAtDesc();
}
