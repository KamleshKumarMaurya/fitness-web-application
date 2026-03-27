package com.demo.auth_service.controller;

import com.demo.auth_service.dto.LoginRequest;
import com.demo.auth_service.service.AuthUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthUserService authUserService;

    @PostMapping("/login")
    public ResponseEntity<?>  login(@RequestBody LoginRequest loginRequest){
        return ResponseEntity.ok(authUserService.login(loginRequest));
    }

    @GetMapping("/{userId}/validate")
    public ResponseEntity<Boolean> validateUser(@PathVariable String userId) {
        log.info("Received validation request for user ID: {}", userId);
        return ResponseEntity.ok(authUserService.existByUserId(userId));
    }

}
