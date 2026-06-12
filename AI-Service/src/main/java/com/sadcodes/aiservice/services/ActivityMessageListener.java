package com.sadcodes.aiservice.services;

import com.sadcodes.aiservice.model.Activity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityMessageListener {

        @KafkaListener(topics = "${app.kafka.topic.name}", groupId = "activity-process-group")
    public void processActivity(Activity activity){
            log.info("Received Activity for processing: {}", activity.getUserId());
    }
}
