package com.demo.user.repo;

import com.demo.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

     User findByEmail(String email);
     boolean existsByEmail(String email);
     Optional<User> findByUuid(String uuid);
     Boolean existsByUuid(String uuid);
}
