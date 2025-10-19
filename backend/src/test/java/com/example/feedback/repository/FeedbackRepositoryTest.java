package com.example.feedback.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import com.example.feedback.model.Feedback;

/**
 * Unit tests for FeedbackRepository.
 * Tests repository operations using @DataJpaTest for isolated database testing.
 */
@DataJpaTest
@ActiveProfiles("test")
class FeedbackRepositoryTest {

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private FeedbackRepository feedbackRepository;

  @BeforeEach
  void setUp() {
    // Clean up database before each test
    feedbackRepository.deleteAll();
    entityManager.flush();
    entityManager.clear();
  }

  @Test
  void testSaveFeedback() {
    // Given
    Feedback feedback = new Feedback("John Doe", "john@example.com", "Great service!");

    // When
    Feedback savedFeedback = feedbackRepository.save(feedback);

    // Then
    assertThat(savedFeedback.getId()).isNotNull();
    assertThat(savedFeedback.getName()).isEqualTo("John Doe");
    assertThat(savedFeedback.getEmail()).isEqualTo("john@example.com");
    assertThat(savedFeedback.getMessage()).isEqualTo("Great service!");
    assertThat(savedFeedback.getCreatedAt()).isNotNull();
    assertThat(savedFeedback.getCreatedAt()).isBefore(LocalDateTime.now().plusSeconds(1));
  }

  @Test
  void testFindById() {
    // Given
    Feedback feedback = new Feedback("Jane Smith", "jane@example.com", "Excellent app!");
    Feedback savedFeedback = entityManager.persistAndFlush(feedback);

    // When
    Optional<Feedback> foundFeedback = feedbackRepository.findById(savedFeedback.getId());

    // Then
    assertThat(foundFeedback).isPresent();
    assertThat(foundFeedback.get().getName()).isEqualTo("Jane Smith");
    assertThat(foundFeedback.get().getEmail()).isEqualTo("jane@example.com");
    assertThat(foundFeedback.get().getMessage()).isEqualTo("Excellent app!");
  }

  @Test
  void testFindByIdNotFound() {
    // When
    Optional<Feedback> foundFeedback = feedbackRepository.findById(999L);

    // Then
    assertThat(foundFeedback).isEmpty();
  }

  @Test
  void testFindAll() {
    // Given
    Feedback feedback1 = new Feedback("User One", "user1@example.com", "First feedback");
    Feedback feedback2 = new Feedback("User Two", "user2@example.com", "Second feedback");
    entityManager.persistAndFlush(feedback1);
    entityManager.persistAndFlush(feedback2);

    // When
    List<Feedback> allFeedback = feedbackRepository.findAll();

    // Then
    assertThat(allFeedback).hasSize(2);
    assertThat(allFeedback).extracting(Feedback::getName)
        .containsExactlyInAnyOrder("User One", "User Two");
  }

  @Test
  void testCount() {
    // Given
    Feedback feedback1 = new Feedback("User 1", "user1@example.com", "Message 1");
    Feedback feedback2 = new Feedback("User 2", "user2@example.com", "Message 2");
    entityManager.persistAndFlush(feedback1);
    entityManager.persistAndFlush(feedback2);

    // When
    long count = feedbackRepository.count();

    // Then
    assertThat(count).isEqualTo(2);
  }

  @Test
  void testTimestampAutoGeneration() {
    // Given
    LocalDateTime beforeSave = LocalDateTime.now();
    Feedback feedback = new Feedback("Test User", "test@example.com", "Test message");

    // When
    Feedback savedFeedback = feedbackRepository.save(feedback);
    LocalDateTime afterSave = LocalDateTime.now();

    // Then
    assertThat(savedFeedback.getCreatedAt()).isNotNull();
    assertThat(savedFeedback.getCreatedAt()).isAfter(beforeSave.minusSeconds(1));
    assertThat(savedFeedback.getCreatedAt()).isBefore(afterSave.plusSeconds(1));
  }
}
