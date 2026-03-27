package com.demo.gateway.jwt;

import com.demo.gateway.service.UserValidationService;
import lombok.RequiredArgsConstructor;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter implements GlobalFilter {

    private final JwtUtil jwtUtil;
    private final UserValidationService userValidationService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        String path = exchange.getRequest().getURI().getPath();

        if (path.startsWith("/auth") || path.startsWith("/register")) {
            return chain.filter(exchange);
        }

        String authHeader = exchange.getRequest()
                .getHeaders()
                .getFirst("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return unauthorized(exchange);
        }

        String token = authHeader.substring(7);

        String userId;

        try {
            // ✅ Sync → use try-catch
            if (!jwtUtil.validateToken(token)) {
                return unauthorized(exchange);
            }

            userId = jwtUtil.extractUserId(token);

        } catch (Exception e) {
            return unauthorized(exchange);
        }

        // ✅ Async → use reactive error handling
        return userValidationService.validateUser(userId)
                .flatMap(isValid -> {
                    if (!isValid) {
                        return unauthorized(exchange);
                    }
                    // ✅ Pass user info downstream
                    exchange.getRequest().mutate()
                            .header("Authorization", "Bearer " + token)
                            .header("X-User-Id", userId)
                            .build();

                    return chain.filter(exchange);
                })
                .onErrorResume(e -> {
                    // 🔥 handles WebClient failure
                    return unauthorized(exchange);
                });
    }

    private Mono<Void> unauthorized(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        return exchange.getResponse().setComplete();
    }
}