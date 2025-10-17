package com.example.feedback.controller;

import com.example.feedback.model.Feedback;
import com.example.feedback.repository.FeedbackRepository;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private static final Logger logger = LoggerFactory.getLogger(FeedbackController.class);

    @Autowired
    private FeedbackRepository feedbackRepository;

    @PostMapping
    public ResponseEntity<Map<String, Object>> submitFeedback(@Valid @RequestBody FeedbackRequest request) {
        logger.info("Received feedback submission request");

        try {
            Feedback feedback = new Feedback(request.getName(), request.getEmail(), request.getMessage());
            Feedback savedFeedback = feedbackRepository.save(feedback);

            Map<String, Object> response = new HashMap<>();
            response.put("id", savedFeedback.getId());
            response.put("name", savedFeedback.getName());
            response.put("message", savedFeedback.getMessage());

            logger.info("Feedback submitted successfully with ID: {}", savedFeedback.getId());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Failed to submit feedback: {}", e.getMessage());
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
        public FeedbackRequest() {}
        public FeedbackRequest(String name, String email, String message) {
            this.name = name;
            this.email = email;
            this.message = message;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
