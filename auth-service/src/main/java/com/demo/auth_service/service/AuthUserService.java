package com.demo.auth_service.service;

import com.demo.auth_service.dto.AuthResponse;
import com.demo.auth_service.dto.LoginRequest;
import com.demo.auth_service.entity.AuthUser;
import com.demo.auth_service.entity.RoleEnum;
import com.demo.auth_service.jwt.JwtUtil;
import com.demo.auth_service.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Objects;

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

        String token = jwtUtil.generateToken(authUser.getEmail());

        return AuthResponse.builder()
                .email(authUser.getEmail())
                .role(authUser.getRole().name())
                .token(token)
                .userId(authUser.getUserId())
                .build();
    }


}
