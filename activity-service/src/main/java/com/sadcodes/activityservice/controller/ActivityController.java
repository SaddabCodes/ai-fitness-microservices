package com.sadcodes.activityservice.controller;

import com.sadcodes.activityservice.dto.ActivityRequest;
import com.sadcodes.activityservice.dto.ActivityResponse;
import com.sadcodes.activityservice.services.ActivityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityService activityService;

    @PostMapping
    public ResponseEntity<ActivityResponse> trackActivity(@Valid @RequestBody ActivityRequest request) {
        return new ResponseEntity<>(activityService.trackActivity(request), HttpStatus.CREATED);
    }
}
