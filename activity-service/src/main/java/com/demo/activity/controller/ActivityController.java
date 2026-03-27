package com.demo.activity.controller;

import com.demo.activity.common.ApiResponse;
import com.demo.activity.dto.ActivityRequest;
import com.demo.activity.service.ActivityService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/activities")
@AllArgsConstructor
public class ActivityController {

    private final ActivityService activityService;

    @PostMapping("/track")
    public ResponseEntity<ApiResponse> getAllActivities(@RequestBody ActivityRequest activityRequest) {
        return activityService.trackActivity(activityRequest);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getActivityById(@PathVariable String id) {
        return activityService.getActivityById(id);
    }

    @GetMapping("/echo")
    public ResponseEntity<ApiResponse> echo(){
        return ResponseEntity.ok(new ApiResponse("Echo from Activity Service", null, "success", null));
    }
}
