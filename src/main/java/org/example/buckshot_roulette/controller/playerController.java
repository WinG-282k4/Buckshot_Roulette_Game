package controller;

import jakarta.servlet.http.HttpSession;
import model.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service.Service;

@RestController
@RequestMapping("/user")
public class playerController {

    @Autowired
    private Service service;

    @PostMapping("/create/{name}")
    public ResponseEntity<Player> CreatePlayer(
            @PathVariable String name,
            HttpSession session
    ){
        Player newPlayer = new Player(name);
        session.setAttribute("player", newPlayer);
        return ResponseEntity.ok(newPlayer);
    }

    @PostMapping("/off")
    public void OffPlayer(
            HttpSession session
    ){
        //
        session.removeAttribute("player");
    }
}
