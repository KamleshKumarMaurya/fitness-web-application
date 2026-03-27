package com.demo.user.service;

import com.demo.user.common.ResourceNotFoundException;
import com.demo.user.common.RoleEnum;
import com.demo.user.dto.RegisterUser;
import com.demo.user.dto.UserResponse;
import com.demo.user.entity.User;
import com.demo.user.repo.UserRepository;
import com.demo.user.response.ApiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final KafkaTemplate<String, byte[]> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Value("${kafka.topic.name}")
    private String topicName;

    public ResponseEntity<ApiResponse> createUser(RegisterUser registerUser) {

        boolean existsByEmail = userRepository.existsByEmail(registerUser.getEmail());

        if (existsByEmail) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiResponse("Email already exists", null, "error", HttpStatus.CONFLICT));
        }

        User user = new User();
        user.setEmail(registerUser.getEmail());
        user.setPassword(registerUser.getPassword());
        user.setFirstName(registerUser.getFirstName());
        user.setLastName(registerUser.getLastName());
        user.setRole(registerUser.getRole().equalsIgnoreCase("Admin") ? RoleEnum.ADMIN : RoleEnum.USER);

        User savedUser = userRepository.save(user);

        try {
            UserResponse authUser = new UserResponse();
            authUser.setEmail(savedUser.getEmail());
            authUser.setRole(savedUser.getRole().name());
            authUser.setPassword(savedUser.getPassword());
            authUser.setUserId(savedUser.getUuid());
            byte[] message = objectMapper.writeValueAsBytes(authUser);
            log.info("Sending user to Kafka topic {}: {}", topicName, authUser.getUserId());
            kafkaTemplate.send(topicName, String.valueOf(authUser.getUserId()), message);
            log.info("Activity sent to Kafka successfully: {}", authUser.getUserId());
        } catch (Exception e) {
            System.err.println("Failed to send user to Kafka: " + e.getMessage());
        }

        UserResponse userResponse = new UserResponse();
        userResponse.setId(savedUser.getUuid());
        userResponse.setEmail(savedUser.getEmail());
        userResponse.setFirstName(savedUser.getFirstName());
        userResponse.setLastName(savedUser.getLastName());
        userResponse.setRole(savedUser.getRole().name());
        userResponse.setCreatedAt(savedUser.getCreatedAt());
        userResponse.setUpdatedAt(savedUser.getUpdatedAt());
        return ResponseEntity.ok(new ApiResponse("User registered successfully", userResponse, "success", HttpStatus.OK));
    }

    public UserResponse getUserById(String id) {

        User user = userRepository.findByUuid(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserResponse userResponse = new UserResponse();
        userResponse.setId(user.getUuid());
        userResponse.setEmail(user.getEmail());
        userResponse.setFirstName(user.getFirstName());
        userResponse.setLastName(user.getLastName());
        userResponse.setRole(user.getRole().name());
        userResponse.setCreatedAt(user.getCreatedAt());
        userResponse.setUpdatedAt(user.getUpdatedAt());

        return userResponse;

    }

    public Boolean existByUserId(String userId) {
        return userRepository.existsByUuid(userId);
    }
}
