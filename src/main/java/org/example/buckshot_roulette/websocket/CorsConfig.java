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
        config.addAllowedOriginPattern("http://192.168.153.1:*");
        config.addAllowedOriginPattern("http://192.168.31.86:*");
        config.addAllowedOriginPattern("http://*.168.*.1:*"); // Cho phép bất kỳ IP 192.168.*.1

        // Allow all headers
        config.addAllowedHeader("*");

        // Allow all methods (GET, POST, etc.)
        config.addAllowedMethod("*");

        // Apply to all paths
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}

