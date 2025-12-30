package org.example.buckshot_roulette.Principal;

import org.example.buckshot_roulette.model.Player;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.security.Principal;
import java.util.Map;
import java.util.UUID;

public class MyHandshakeHandler extends DefaultHandshakeHandler {
    private static final Logger logger = LoggerFactory.getLogger(MyHandshakeHandler.class);

    @Override
    protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler, Map<String, Object> attributes) {
        // Lấy thông tin player mà Interceptor đã copy từ HttpSession sang
        Player player = (Player) attributes.get("player");

        // Nếu player có trong session, use player ID
        if (player != null) {
            String playerId = player.getId();
            logger.info("WebSocket Principal set to player ID: {}", playerId);
            return new StompPrincipal(playerId);
        }

        // Session expired: tạo temporary principal từ UUID
        // Principal này sẽ được dùng để identify connection, backend sẽ handle logic từ payload
        String sessionId = UUID.randomUUID().toString();
        logger.warn("Session expired: Creating temporary WebSocket principal: {}", sessionId);
        return new StompPrincipal(sessionId);
    }
}

