package com.example.feedback.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.example.feedback.model.Feedback;
import com.example.feedback.repository.FeedbackRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Unit tests for FeedbackController.
 * Tests the simplified controller with mocked repository.
 */
@WebMvcTest(FeedbackController.class)
class FeedbackControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FeedbackRepository feedbackRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private FeedbackController.FeedbackRequest validRequest;
    private Feedback savedFeedback;

    @BeforeEach
    void setUp() {
        validRequest = new FeedbackController.FeedbackRequest();
        validRequest.setName("John Doe");
        validRequest.setEmail("john@example.com");
        validRequest.setMessage("Great service!");

        savedFeedback = new Feedback();
        savedFeedback.setId(1L);
        savedFeedback.setName("John Doe");
        savedFeedback.setEmail("john@example.com");
        savedFeedback.setMessage("Great service!");
        savedFeedback.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void testSubmitFeedback_Success() throws Exception {
        // Given
        when(feedbackRepository.save(any(Feedback.class))).thenReturn(savedFeedback);

        // When & Then
        mockMvc.perform(post("/api/feedback")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("John Doe"))
                .andExpect(jsonPath("$.message").value("Great service!"));
    }

    @Test
    void testSubmitFeedback_ValidationError_MissingName() throws Exception {
        // Given
        validRequest.setName("");

        // When & Then
        mockMvc.perform(post("/api/feedback")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation failed"))
                .andExpect(jsonPath("$.details").exists());
    }

    @Test
    void testSubmitFeedback_ValidationError_InvalidEmail() throws Exception {
        // Given
        validRequest.setEmail("invalid-email");

        // When & Then
        mockMvc.perform(post("/api/feedback")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation failed"))
                .andExpect(jsonPath("$.details").exists());
    }

    @Test
    void testSubmitFeedback_ValidationError_EmptyMessage() throws Exception {
        // Given
        validRequest.setMessage("");

        // When & Then
        mockMvc.perform(post("/api/feedback")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation failed"))
                .andExpect(jsonPath("$.details").exists());
    }

    @Test
    void testSubmitFeedback_ValidationError_NameTooLong() throws Exception {
        // Given
        validRequest.setName("a".repeat(101)); // Exceeds 100 character limit

        // When & Then
        mockMvc.perform(post("/api/feedback")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation failed"))
                .andExpect(jsonPath("$.details").exists());
    }

    @Test
    void testSubmitFeedback_ValidationError_EmailTooLong() throws Exception {
        // Given
        validRequest.setEmail("a".repeat(250) + "@example.com"); // Exceeds 255 character limit

        // When & Then
        mockMvc.perform(post("/api/feedback")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation failed"))
                .andExpect(jsonPath("$.details").exists());
    }

    @Test
    void testSubmitFeedback_ValidationError_MessageTooLong() throws Exception {
        // Given
        validRequest.setMessage("a".repeat(1001)); // Exceeds 1000 character limit

        // When & Then
        mockMvc.perform(post("/api/feedback")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation failed"))
                .andExpect(jsonPath("$.details").exists());
    }

    @Test
    void testSubmitFeedback_RepositoryException() throws Exception {
        // Given
        when(feedbackRepository.save(any(Feedback.class)))
                .thenThrow(new RuntimeException("Database error"));

        // When & Then
        mockMvc.perform(post("/api/feedback")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.error").value("Internal server error"))
                .andExpect(jsonPath("$.details").value("An unexpected error occurred. Please try again later."));
    }
}
