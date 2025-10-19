package com.example.feedback.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, Object>> handleValidationException(MethodArgumentNotValidException ex) {
    logger.warn("Validation failed for feedback submission: {}", ex.getMessage());
    logger.debug("Validation error details: ", ex);

    Map<String, Object> response = new HashMap<>();
    response.put("error", "Validation failed");

    String details = ex.getBindingResult()
        .getFieldErrors()
        .stream()
        .map(error -> error.getDefaultMessage())
        .collect(Collectors.joining(", "));

    response.put("details", details);
    response.put("timestamp", LocalDateTime.now());

    return ResponseEntity.badRequest().body(response);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<Map<String, Object>> handleGeneralException(Exception ex) {
    logger.error("Unexpected error occurred: {}", ex.getMessage());
    logger.debug("Error details: ", ex);

    Map<String, Object> response = new HashMap<>();
    response.put("error", "Internal server error");
    response.put("details", "An unexpected error occurred. Please try again later.");
    response.put("timestamp", LocalDateTime.now());

    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
  }
}
