package com.example.feedback.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.feedback.model.Feedback;
import com.example.feedback.repository.FeedbackRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private static final Logger logger = LoggerFactory.getLogger(FeedbackController.class);

    @Autowired
    private FeedbackRepository feedbackRepository;

    /**
     * Get all feedback entries.
     * Logs the retrieval operation as required by the exercise.
     */
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllFeedback() {
        logger.info("Received request to retrieve all feedback");

        try {
            List<Feedback> feedbackList = feedbackRepository.findAll();

            List<Map<String, Object>> response = feedbackList.stream()
                    .map(feedback -> {
                        Map<String, Object> feedbackMap = new HashMap<>();
                        feedbackMap.put("id", feedback.getId());
                        feedbackMap.put("name", feedback.getName());
                        feedbackMap.put("email", feedback.getEmail());
                        feedbackMap.put("message", feedback.getMessage());
                        feedbackMap.put("createdAt", feedback.getCreatedAt());
                        return feedbackMap;
                    })
                    .collect(Collectors.toList());

            logger.info("Successfully retrieved {} feedback entries", feedbackList.size());
            logger.debug("Response created with {} feedback entries", response.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Failed to retrieve feedback: {}", e.getMessage());
            logger.debug("Error details: ", e);
            throw e;
        }
    }

    /**
     * Submit new feedback.
     * Logs incoming requests and responses as required by the exercise.
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> submitFeedback(@Valid @RequestBody FeedbackRequest request) {
        logger.info("Received feedback submission request for user: [REDACTED]");
        logger.debug("Request details - Name length: {}, Email length: {}, Message length: {}",
                request.getName() != null ? request.getName().length() : 0,
                request.getEmail() != null ? request.getEmail().length() : 0,
                request.getMessage() != null ? request.getMessage().length() : 0);

        try {
            // Create and save feedback
            Feedback feedback = new Feedback(request.getName(), request.getEmail(), request.getMessage());
            Feedback savedFeedback = feedbackRepository.save(feedback);

            // Create response
            Map<String, Object> response = new HashMap<>();
            response.put("id", savedFeedback.getId());
            response.put("name", savedFeedback.getName());
            response.put("message", savedFeedback.getMessage());

            logger.info("Feedback submitted successfully with ID: {}", savedFeedback.getId());
            logger.debug("Response created for feedback ID: {}", savedFeedback.getId());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Failed to submit feedback: {}", e.getMessage());
            logger.debug("Error details: ", e);
            throw e;
        }
    }

    public static class FeedbackRequest {
        @jakarta.validation.constraints.NotBlank(message = "Name is required")
        @jakarta.validation.constraints.Size(max = 100, message = "Name must not exceed 100 characters")
        private String name;

        @jakarta.validation.constraints.NotBlank(message = "Email is required")
        @jakarta.validation.constraints.Email(message = "Please enter a valid email address")
        @jakarta.validation.constraints.Size(max = 255, message = "Email must not exceed 255 characters")
        private String email;

        @jakarta.validation.constraints.NotBlank(message = "Message is required")
        @jakarta.validation.constraints.Size(max = 1000, message = "Message must not exceed 1000 characters")
        private String message;

        // Constructors, getters and setters
        public FeedbackRequest() {
        }

        public FeedbackRequest(String name, String email, String message) {
            this.name = name;
            this.email = email;
            this.message = message;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
