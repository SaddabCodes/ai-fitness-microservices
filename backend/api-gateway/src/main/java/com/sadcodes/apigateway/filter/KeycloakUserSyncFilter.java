package com.sadcodes.apigateway.filter;

import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.sadcodes.apigateway.user.RegisterRequest;
import com.sadcodes.apigateway.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.text.ParseException;


@Component
@RequiredArgsConstructor
@Slf4j
public class KeycloakUserSyncFilter implements WebFilter {

    private final UserService userService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        try {
            String userId = exchange.getRequest().getHeaders().getFirst("X-USER-ID");
            String token = exchange.getRequest().getHeaders().getFirst("Authorization");

            if (token == null || token.isEmpty()) {
                log.warn("No authorization token provided");
                return chain.filter(exchange);
            }

            RegisterRequest registerRequest = getUserDetails(token);
            if (registerRequest == null) {
                log.warn("Could not extract user details from token");
                return chain.filter(exchange);
            }

            if (userId == null) {
                userId = registerRequest.getKeycloakId();
            }

            if (userId == null) {
                log.warn("No user ID available");
                return chain.filter(exchange);
            }

            String finalUserId = userId;
            String finalUserId1 = userId;
            return userService.validateUser(userId)
                    .flatMap(exist -> {
                        if (!exist) {
                            log.info("User {} does not exist, attempting to register", finalUserId1);
                            if (registerRequest != null) {
                                return userService.registerUser(registerRequest)
                                        .doOnSuccess(u -> log.info("User {} registered successfully", registerRequest.getEmail()))
                                        .doOnError(e -> log.error("Error registering user {}: {}", registerRequest.getEmail(), e.getMessage()))
                                        .onErrorResume(e -> {
                                            log.error("Failed to register user, continuing anyway", e);
                                            return Mono.empty();
                                        })
                                        .then(Mono.empty());
                            } else {
                                return Mono.empty();
                            }
                        } else {
                            log.debug("User {} already exists, skipping registration", finalUserId1);
                            return Mono.empty();
                        }
                    })
                    .then(Mono.defer(() -> {
                        ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                                .header("X-USER-ID", finalUserId)
                                .build();
                        return chain.filter(exchange.mutate().request(mutatedRequest).build());
                    }))
                    .onErrorResume(e -> {
                        log.error("Error in user sync filter", e);
                        return chain.filter(exchange);
                    });
        } catch (Exception e) {
            log.error("Unexpected error in KeycloakUserSyncFilter", e);
            return chain.filter(exchange);
        }
    }

    private RegisterRequest getUserDetails(String token) {
        try {
            String tokenWithoutBearer = token.replace("Bearer", "").trim();
            SignedJWT signedJWT = SignedJWT.parse(tokenWithoutBearer);
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();

            RegisterRequest request = new RegisterRequest();
            request.setEmail(claims.getStringClaim("email"));
            request.setKeycloakId(claims.getStringClaim("sub"));
            request.setFirstName(claims.getStringClaim("given_name"));
            request.setLastName(claims.getStringClaim("family_name"));
            request.setPassword("DefaultPassword123");

            return request;

        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }
}
