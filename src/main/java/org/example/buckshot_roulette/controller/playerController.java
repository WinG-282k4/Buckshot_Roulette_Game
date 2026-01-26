package org.example.buckshot_roulette.controller;

import jakarta.servlet.http.HttpSession;
import org.example.buckshot_roulette.dto.ActionResult;
import org.example.buckshot_roulette.dto.PlayerResponseDTO;
import org.example.buckshot_roulette.model.Player;
import org.example.buckshot_roulette.model.Room;
import org.example.buckshot_roulette.service.playerService;
import org.example.buckshot_roulette.service.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class playerController {

    // Logger for incoming REST APIs
    private static final Logger logger = LoggerFactory.getLogger(playerController.class);

    @Autowired
    private playerService playerservice;

    @Autowired
    private Service service;

    @PostMapping("/create/{name}")
    public ResponseEntity<PlayerResponseDTO> CreatePlayer(
            @PathVariable String name,
            HttpSession session
    ){
        Player existingPlayer = (Player) session.getAttribute("player");

        if(existingPlayer != null){
            logger.info("Player already in session: {}", existingPlayer.getName());
            return ResponseEntity.ok(PlayerResponseDTO.fromPlayer(existingPlayer));
        }

        logger.info("Received API: POST /user/create/{}", name);
        ActionResult newPlayer = playerservice.createPlayer(name);
        if(!newPlayer.getIsSuccess()){
            logger.info("Create player not success: {}", newPlayer.getMessage());
            return ResponseEntity.badRequest().build();
        }
        Player createdPlayer = (Player) newPlayer.getData();
        session.setAttribute("player", createdPlayer);
        return ResponseEntity.ok(PlayerResponseDTO.fromPlayer(createdPlayer));
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
    public ResponseEntity<PlayerResponseDTO> UpdateAvatar(
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
            Player updatedPlayerObj = (Player) updatedPlayer.getData();
            session.setAttribute("player", updatedPlayerObj);
            return ResponseEntity.ok(PlayerResponseDTO.fromPlayer(updatedPlayerObj));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> GetCurrentPlayer(
            HttpSession session
    ) {
        Player player = (Player) session.getAttribute("player");
        logger.info("Received API: GET /user/me");

        if (player == null) {
            logger.warn("No player in session");
            return ResponseEntity.status(401).build();
        }

        logger.info("Returning current player: {}", player.getName());
        Map<String, Object> playermap = new HashMap<>();
        playermap.put("name", player.getName());
        playermap.put("ID", player.getId());
        playermap.put("URLavatar", player.getURLavatar());

        // Find room by player ID instead of relying on session attribute
        Room playerRoom = service.getRoomByPlayerId(player.getId());
        if (playerRoom != null) {
            playermap.put("roomid", playerRoom.getID());
            logger.info("Found player {} in room {}", player.getName(), playerRoom.getID());
        } else {
            playermap.put("roomid", null);
            logger.info("Player {} is not in any room", player.getName());
        }

        return ResponseEntity.ok(playermap);
    }
}
