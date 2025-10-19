package com.example.feedback.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

/**
 * Unit tests for GlobalExceptionHandler.
 * Tests the simplified exception handler.
 */
@ExtendWith(MockitoExtension.class)
class GlobalExceptionHandlerTest {

    @InjectMocks
    private GlobalExceptionHandler globalExceptionHandler;

    @Test
    void testHandleValidationException() {
        // Given
        MethodArgumentNotValidException ex = mock(MethodArgumentNotValidException.class);
        BindingResult bindingResult = mock(BindingResult.class);

        FieldError fieldError1 = new FieldError("feedbackRequest", "name", "Name is required");
        FieldError fieldError2 = new FieldError("feedbackRequest", "email", "Please enter a valid email address");

        when(ex.getBindingResult()).thenReturn(bindingResult);
        when(bindingResult.getFieldErrors()).thenReturn(Arrays.asList(fieldError1, fieldError2));

        // When
        ResponseEntity<Map<String, Object>> response = globalExceptionHandler.handleValidationException(ex);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("error")).isEqualTo("Validation failed");
        assertThat(response.getBody().get("details")).isEqualTo("Name is required, Please enter a valid email address");
        assertThat(response.getBody().get("timestamp")).isNotNull();
    }

    @Test
    void testHandleValidationException_EmptyFieldErrors() {
        // Given
        MethodArgumentNotValidException ex = mock(MethodArgumentNotValidException.class);
        BindingResult bindingResult = mock(BindingResult.class);

        when(ex.getBindingResult()).thenReturn(bindingResult);
        when(bindingResult.getFieldErrors()).thenReturn(Arrays.asList());

        // When
        ResponseEntity<Map<String, Object>> response = globalExceptionHandler.handleValidationException(ex);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("error")).isEqualTo("Validation failed");
        assertThat(response.getBody().get("details")).isEqualTo("");
        assertThat(response.getBody().get("timestamp")).isNotNull();
    }

    @Test
    void testHandleGeneralException() {
        // Given
        Exception ex = new Exception("Test exception");

        // When
        ResponseEntity<Map<String, Object>> response = globalExceptionHandler.handleGeneralException(ex);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("error")).isEqualTo("Internal server error");
        assertThat(response.getBody().get("details"))
                .isEqualTo("An unexpected error occurred. Please try again later.");
        assertThat(response.getBody().get("timestamp")).isNotNull();
    }
}