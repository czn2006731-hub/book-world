package com.bookemulator.repository;

import com.bookemulator.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    
    // 支持按昵称或ID进行搜索
    List<User> findByNicknameContainingIgnoreCase(String nickname);
}
