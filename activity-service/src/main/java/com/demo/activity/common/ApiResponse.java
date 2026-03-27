package com.demo.activity.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse {

    private Boolean successful;
    private String message;
    private Object data;
    private String status;
    private HttpStatus httpStatus;


    public ApiResponse(String message, Object data, String status, HttpStatus httpStatus) {
        this.message = message;
        this.data = data;
        this.status = status;
        this.httpStatus = httpStatus;
    }

    public ApiResponse(boolean b, String validationFailed, Map<String, String> errors) {
        	this.successful = b;
        	this.message = validationFailed;
        	this.data = errors;
        	this.status = "error";
        	this.httpStatus = HttpStatus.BAD_REQUEST;
    }
}
