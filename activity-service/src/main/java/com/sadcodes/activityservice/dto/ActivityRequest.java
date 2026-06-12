package com.sadcodes.activityservice.dto;

import com.sadcodes.activityservice.model.ActivityType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
public class ActivityRequest {

    @NotBlank(message = "userId is required")
    private String userId;

    @NotNull(message = "type is required")
    private ActivityType type;

    @NotNull(message = "duration is required")
    private Integer duration;

    @NotNull(message = "caloriesBurned is required")
    private Integer caloriesBurned;

    @NotNull(message = "startTime is required")
    private LocalDateTime startTime;

    private Map<String,Object> additionalMetrics;
}
