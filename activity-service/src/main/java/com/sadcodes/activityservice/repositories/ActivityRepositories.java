package com.sadcodes.activityservice.repositories;

import com.sadcodes.activityservice.model.Activity;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ActivityRepositories extends MongoRepository<Activity,String > {
}
