package controller;

import jakarta.servlet.http.HttpSession;
import model.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttribute;
import service.Service;

@RestController
@RequestMapping("/user")
public class Playercontroller {

    @Autowired
    private Service service;

    @RequestMapping("/creat/{name}")
    public void CreatePlayer(
            @PathVariable String name,
            HttpSession session
    ){
        Player newPlayer = new Player(name);
        session.setAttribute("player", newPlayer);
    }

    @RequestMapping("/off")
    public void OffPlayer(
            @SessionAttribute("player") Player player
    ){
        //
    }
}
