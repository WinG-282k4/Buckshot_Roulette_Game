package org.example.buckshot_roulette.websocket;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // Allow credentials (cookies, authorization headers)
        config.setAllowCredentials(true);

        // Allow frontend origin
        config.addAllowedOriginPattern("http://localhost:5173");
        config.addAllowedOriginPattern("http://localhost:*");

        // Allow all headers
        config.addAllowedHeader("*");

        // Allow all methods (GET, POST, etc.)
        config.addAllowedMethod("*");

        // Apply to all paths
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}

