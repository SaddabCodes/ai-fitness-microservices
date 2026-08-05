package com.sadcodes.activityservice.repositories;

import com.sadcodes.activityservice.model.Activity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ActivityRepositories extends MongoRepository<Activity,String > {
    List<Activity> findByUserId(String userId);
}
