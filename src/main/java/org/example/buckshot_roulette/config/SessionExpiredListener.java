package org.example.buckshot_roulette.config;

import jakarta.servlet.http.HttpSessionEvent;
import jakarta.servlet.http.HttpSessionListener;
import org.example.buckshot_roulette.model.Player;
import org.example.buckshot_roulette.service.playerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class SessionExpiredListener implements HttpSessionListener {

    @Autowired
    private playerService playerservice;

    @Override
    public void sessionDestroyed(HttpSessionEvent se) {
        // Khi session hết hạn (timeout), hàm này tự chạy
        Player player = (Player) se.getSession().getAttribute("player");
        if (player != null) {
            playerservice.removePlayer(player.getId());
            System.out.println("Session timeout! Đã xóa player: " + player.getName());
        }
    }
}