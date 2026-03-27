package com.demo.activity.service;

import com.demo.activity.common.ApiResponse;
import com.demo.activity.dto.ActivityRequest;
import com.demo.activity.dto.ActivityResponse;
import com.demo.activity.entity.Activity;
import com.demo.activity.repo.ActivityRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;


@Slf4j
@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final UserValidationService userValidationService;
    private final KafkaTemplate<String, byte[]> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Value("${kafka.topic.name}")
    private String topicName;

    public ResponseEntity<ApiResponse> trackActivity(ActivityRequest activityRequest) {
        boolean validateUser = userValidationService.validateUser(activityRequest.getUserId());
        if(!validateUser){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse("Invalid User ID", null, "error", HttpStatus.BAD_REQUEST));
        }
        Activity activity = Activity.builder()
                .userId(activityRequest.getUserId())
                .activityType(activityRequest.getActivityType())
                .duration(activityRequest.getDuration())
                .caloriesBurned(activityRequest.getCaloriesBurned())
                .startTime(activityRequest.getStartTime())
                .additionalMetrics(activityRequest.getAdditionalMetrics())
                .build();

        Activity save = activityRepository.save(activity);

        try {
            byte[] message = objectMapper.writeValueAsBytes(save);
            log.info("Sending activity to Kafka topic {}: {}", topicName, save.getId());
            kafkaTemplate.send(topicName, String.valueOf(save.getId()), message);
            log.info("Activity sent to Kafka successfully: {}", save.getId());
        } catch (Exception e) {
            System.err.println("Failed to send activity to Kafka: " + e.getMessage());
        }

        return ResponseEntity.ok(new ApiResponse("Activity Track", mapToResponse(save), "success", HttpStatus.OK));

    }

    public ActivityResponse mapToResponse(Activity activity) {
        ActivityResponse response = new ActivityResponse();
        response.setId(activity.getId());
        response.setUserId(activity.getUserId());
        response.setActivityType(activity.getActivityType());
        response.setDuration(activity.getDuration());
        response.setCaloriesBurned(activity.getCaloriesBurned());
        response.setStartTime(activity.getStartTime());
        response.setEndTime(activity.getEndTime());
        response.setAdditionalMetrics(activity.getAdditionalMetrics());
        response.setCreatedAt(activity.getCreatedAt());
        response.setUpdatedAt(activity.getUpdatedAt());
        return response;
    }

    public ResponseEntity<ApiResponse> getActivityById(String id) {
        List<Activity> byUserId = activityRepository.findByUserId(id);
        if(byUserId.isEmpty()){
            return ResponseEntity.ok(new ApiResponse("Activities retrieved successfully", byUserId, "success", HttpStatus.OK));
        }
        List<ActivityResponse> activityResponses = byUserId.stream().map(this::mapToResponse).toList();
        return ResponseEntity.ok(new ApiResponse("Activities retrieved successfully", activityResponses, "success", HttpStatus.OK));
    }
}
