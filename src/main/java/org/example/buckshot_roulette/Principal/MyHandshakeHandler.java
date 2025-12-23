package org.example.buckshot_roulette.Principal;

import org.example.buckshot_roulette.model.Player;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.Map;

public class MyHandshakeHandler extends DefaultHandshakeHandler {
    @Override
    protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler, Map<String, Object> attributes) {
        // Lấy thông tin player mà Interceptor đã copy từ HttpSession sang
        Player player = (Player) attributes.get("player");

        // Gán ID của player làm "tên định danh" cho kết nối này
        return new StompPrincipal(String.valueOf(player.getId()));
    }
}