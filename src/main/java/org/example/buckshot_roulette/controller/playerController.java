package org.example.buckshot_roulette.controller;

import jakarta.servlet.http.HttpSession;
import org.example.buckshot_roulette.dto.ActionResult;
import org.example.buckshot_roulette.model.Player;
import org.example.buckshot_roulette.service.playerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class playerController {

    // Logger for incoming REST APIs
    private static final Logger logger = LoggerFactory.getLogger(playerController.class);

    @Autowired
    private playerService playerservice;

    public playerController() {
    }

    @PostMapping("/create/{name}")
    public ResponseEntity<Player> CreatePlayer(
            @PathVariable String name,
            HttpSession session
    ){
        Player player = (Player) session.getAttribute("player");
        if (player != null) {
            session.removeAttribute("player");
            playerservice.removePlayer(player.getId());
            logger.info("Player already exists in session: {}", player.getName());
        }
        logger.info("Received API: POST /user/create/{}", name);
        ActionResult newPlayer = playerservice.createPlayer(name);
        if(!newPlayer.getIsSuccess()){
            return ResponseEntity.badRequest().build();
        }
        session.setAttribute("player", newPlayer.getData());
        return ResponseEntity.ok((Player) newPlayer.getData());
    }

    @PostMapping("/off")
    public ResponseEntity<String> OffPlayer(
            HttpSession session
    ){
        logger.info("Received API: POST /user/off (removing player from session)");
        Player player = (Player) session.getAttribute("player");
        session.removeAttribute("player");
        playerservice.removePlayer(player.getId());
        return ResponseEntity.ok("Player session cleared");
    }

    @PostMapping("/updateavatar/{avatar}")
    public ResponseEntity<Player> UpdateAvatar(
            @PathVariable String avatar,
            HttpSession session
    ) {
        Player player = (Player) session.getAttribute("player");
        logger.info("Received API: POST /user/updateavatar/{} by player {}", avatar,
                player != null ? player.getId() : "unknown");
        if (player == null) {
            return ResponseEntity.status(401).build();
        }

        ActionResult updatedPlayer = playerservice.updatePlayerAvatar(player.getId(), avatar);
        if (!updatedPlayer.getIsSuccess()) {
            return ResponseEntity.badRequest().build();
        }else  {
            session.setAttribute("player", updatedPlayer.getData());
            return ResponseEntity.ok((Player) updatedPlayer.getData());
        }
    }
}
