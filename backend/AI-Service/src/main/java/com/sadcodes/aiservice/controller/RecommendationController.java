package com.sadcodes.aiservice.controller;

import com.sadcodes.aiservice.model.Recommendation;
import com.sadcodes.aiservice.services.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/user/{userId}")
  public ResponseEntity<List<Recommendation>>getUserRecommendation(@PathVariable String userId){
      return ResponseEntity.ok(recommendationService.getUserRecommendation(userId));
  }

  @GetMapping("/activity/{activityId}")
    public ResponseEntity<Recommendation> getActivityRecommendation(@PathVariable String activityId) {
      Optional<Recommendation> recommendation = recommendationService.getActivityRecommendation(activityId);
      return recommendation
              .map(ResponseEntity::ok)
              .orElseGet(() -> ResponseEntity.status(HttpStatus.ACCEPTED).build());
    }
}
