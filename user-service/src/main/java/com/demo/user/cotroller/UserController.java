package com.demo.user.cotroller;

import com.demo.user.dto.RegisterUser;
import com.demo.user.dto.UserResponse;
import com.demo.user.response.ApiResponse;
import com.demo.user.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getUserProfile(@PathVariable String id) {
        UserResponse userResponse =  userService.getUserById(id);
        return ResponseEntity.ok(new ApiResponse("User profile retrieved successfully", userResponse, "success", HttpStatus.OK));
    }
    @GetMapping("/{userId}/validate")
    public ResponseEntity<Boolean> validateUser(@PathVariable String userId) {
        return ResponseEntity.ok(userService.existByUserId(userId));
    }


    @PostMapping("/register")
    public ResponseEntity<ApiResponse> registerUser(@Valid @RequestBody RegisterUser registerUser) {
       return userService.createUser(registerUser);
    }
}
