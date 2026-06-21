package com.sadcodes.apigateway.user;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;


@Slf4j
@RequiredArgsConstructor
@Service
public class UserService {

    private final WebClient userServiceWebClient;

    public Mono<Boolean> validateUser(String userId){
        log.info("Calling User Service for {}", userId);
        return userServiceWebClient.get()
                .uri("/api/users/{userId}/validate", userId)
                .retrieve()
                .bodyToMono(Boolean.class)
                .doOnError(e -> log.error("Error validating user {}: {}", userId, e.getMessage()))
                .onErrorResume(WebClientResponseException.class, e -> {
                    log.error("WebClient response error: status={}, body={}", e.getStatusCode(), e.getResponseBodyAsString());
                    if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                        return Mono.just(false);
                    }
                    if (e.getStatusCode() == HttpStatus.BAD_REQUEST) {
                        return Mono.just(false);
                    }
                    return Mono.error(new RuntimeException("Service error: " + e.getStatusCode()));
                })
                .onErrorResume(WebClientRequestException.class, e -> {
                    log.error("WebClient request error: {}", e.getMessage());
                    return Mono.error(new RuntimeException("Service unavailable: " + e.getMessage()));
                })
                .onErrorReturn(false);
    }

    public Mono<UserResponse> registerUser(RegisterRequest registerRequest) {
        log.info("Calling User Registration for {}", registerRequest.getEmail());
        return userServiceWebClient.post()
                .uri("/api/users/register")
                .bodyValue(registerRequest)
                .retrieve()
                .bodyToMono(UserResponse.class)
                .doOnError(e -> log.error("Error registering user {}: {}", registerRequest.getEmail(), e.getMessage()))
                .onErrorResume(WebClientResponseException.class, e -> {
                    log.error("WebClient response error: status={}, body={}", e.getStatusCode(), e.getResponseBodyAsString());
                    if (e.getStatusCode() == HttpStatus.BAD_REQUEST) {
                        return Mono.error(new RuntimeException("Bad request: " + e.getResponseBodyAsString()));
                    }
                    if (e.getStatusCode() == HttpStatus.CONFLICT) {
                        return Mono.error(new RuntimeException("User already exists"));
                    }
                    return Mono.error(new RuntimeException("Service error: " + e.getStatusCode()));
                })
                .onErrorResume(WebClientRequestException.class, e -> {
                    log.error("WebClient request error: {}", e.getMessage());
                    return Mono.error(new RuntimeException("Service unavailable: " + e.getMessage()));
                });
    }
}
