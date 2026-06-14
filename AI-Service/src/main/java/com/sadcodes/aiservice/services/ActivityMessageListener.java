package com.sadcodes.aiservice.services;

import com.sadcodes.aiservice.model.Activity;
import com.sadcodes.aiservice.model.Recommendation;
import com.sadcodes.aiservice.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityMessageListener {

    private final ActivityAiService activityAiService;
    private final RecommendationRepository recommendationRepository;

    @KafkaListener(topics = "${app.kafka.topic.name}", groupId = "activity-process-group")
    public void processActivity(Activity activity) {
        log.info("Received Activity for processing: {}", activity.getUserId());
        Recommendation recommendation = activityAiService.generateRecommendation(activity);
        recommendationRepository.save(recommendation);
    }
}
