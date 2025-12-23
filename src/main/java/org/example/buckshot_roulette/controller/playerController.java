package org.example.buckshot_roulette.controller;

import jakarta.servlet.http.HttpSession;
import org.example.buckshot_roulette.model.Player;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    @PostMapping("/create/{name}")
    public ResponseEntity<Player> CreatePlayer(
            @PathVariable String name,
            HttpSession session
    ){
        logger.info("Received API: POST /user/create/{}", name);
        Player newPlayer = new Player(name);
        session.setAttribute("player", newPlayer);
        return ResponseEntity.ok(newPlayer);
    }

    @PostMapping("/off")
    public void OffPlayer(
            HttpSession session
    ){
        logger.info("Received API: POST /user/off (removing player from session)");
        //
        session.removeAttribute("player");
    }
}
