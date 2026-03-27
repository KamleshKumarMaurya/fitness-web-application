package com.demo.auth_service.repo;

import com.demo.auth_service.entity.AuthUser;
import com.demo.auth_service.entity.RoleEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<AuthUser, Long> {


    Optional<AuthUser> findByEmailAndPassword(String email, String password);
}
