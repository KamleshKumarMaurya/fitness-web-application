package com.demo.auth_service.service;

import com.demo.auth_service.entity.AuthUser;
import com.demo.auth_service.repo.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Slf4j
@Service
public class UserConsumeService {

    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;

    @KafkaListener(topics = "${kafka.topic.request}",
            groupId = "user-created-group",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void consume(byte[] message) {
        try {
            AuthUser authUser = objectMapper.readValue(message, AuthUser.class);
            log.info("Received activity for user: {}", authUser.getUserId());
//            processWithAI(activity);
            userRepository.save(authUser);

        } catch (Exception e) {
            log.error("Failed to process Kafka message", e);
        }
    }
}
