package com.sadcodes.activityservice.services;

import com.sadcodes.activityservice.dto.ActivityRequest;
import com.sadcodes.activityservice.dto.ActivityResponse;
import com.sadcodes.activityservice.model.Activity;
import com.sadcodes.activityservice.repositories.ActivityRepositories;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepositories activityRepositories;
    private final UserValidationService userValidationService;
    private final KafkaTemplate<String ,Activity>kafkaTemplate;

    @Value("${kafka.topic.name}")
    private String topicName;

    public ActivityResponse trackActivity(ActivityRequest request) {

        boolean isValidUser = userValidationService.validateUser(request.getUserId());
        if (!isValidUser) {
            throw new RuntimeException("Invalid User: "+ request.getUserId());
        }

        Activity activity = Activity.builder()
                .userId(request.getUserId())
                .type(request.getType())
                .duration(request.getDuration())
                .caloriesBurned(request.getCaloriesBurned())
                .startTime(request.getStartTime())
                .additionalMetrics(request.getAdditionalMetrics())
                .build();

        Activity saveActivity = activityRepositories.save(activity);

        try{
            kafkaTemplate.send(topicName,saveActivity.getUserId(),saveActivity);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return mapToResponse(saveActivity);
    }

    private ActivityResponse mapToResponse(Activity saveActivity) {
        ActivityResponse activityResponse = new ActivityResponse();
        activityResponse.setId(saveActivity.getId());
        activityResponse.setUserId(saveActivity.getUserId());
        activityResponse.setType(saveActivity.getType());
        activityResponse.setDuration(saveActivity.getDuration());
        activityResponse.setCaloriesBurned(saveActivity.getCaloriesBurned());
        activityResponse.setStartTime(saveActivity.getStartTime());
        activityResponse.setAdditionalMetrics(saveActivity.getAdditionalMetrics());
        activityResponse.setCreatedAt(saveActivity.getCreatedAt());
        activityResponse.setUpdatedAt(saveActivity.getUpdatedAt());
        return activityResponse;


    }
}
