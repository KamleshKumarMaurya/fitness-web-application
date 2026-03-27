package com.demo.aiservice.service;

import com.demo.aiservice.model.Activity;
import com.demo.aiservice.model.Recommendation;
import com.demo.aiservice.repo.RecommendationRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityMessageConsumer {

    private final ObjectMapper objectMapper;
    private final ActivityAIService activityAIService;
    private final RecommendationRepository recommendationRepository;

    @KafkaListener(topics = "${kafka.topic.request}",
            groupId = "activity-processor-group",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void consume(byte[] message) {
        try {
            Activity activity = objectMapper.readValue(message, Activity.class);
            log.info("Received activity for user: {}", activity.getUserId());
            processWithAI(activity);

        } catch (Exception e) {
            log.error("Failed to process Kafka message", e);
        }
    }

    private void processWithAI(Activity activity) {
        // placeholder (we build next)
        log.info("Processing AI for user: {}", activity.getUserId());
        Recommendation recommendation = activityAIService.generateRecommendation(activity);
        recommendationRepository.save(recommendation);
    }
}