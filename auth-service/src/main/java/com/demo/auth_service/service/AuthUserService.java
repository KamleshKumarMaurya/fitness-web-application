package com.demo.auth_service.service;

import com.demo.auth_service.dto.AuthResponse;
import com.demo.auth_service.dto.LoginRequest;
import com.demo.auth_service.entity.AuthUser;
import com.demo.auth_service.entity.RoleEnum;
import com.demo.auth_service.jwt.JwtUtil;
import com.demo.auth_service.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthUserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public AuthResponse login(LoginRequest loginRequest){
        AuthUser authUser = userRepository.findByEmailAndPassword(
                loginRequest.getEmail(),
                loginRequest.getPassword()
        ).orElseThrow(() -> new RuntimeException("Invalid credentials"));

        String token = jwtUtil.generateToken(authUser);

        return AuthResponse.builder()
                .email(authUser.getEmail())
                .role(authUser.getRole().name())
                .token(token)
                .userId(authUser.getUserId())
                .build();
    }

    @Cacheable(value = "user-exists", key = "#userId", unless = "#result == false")
    public Boolean existByUserId(String userId) {
        log.info("Checking existence of user with ID: {}", userId);
        return userRepository.existsByUserId(userId);
    }

}
