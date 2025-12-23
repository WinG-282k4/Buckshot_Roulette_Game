package controller;

import model.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttribute;
import service.Service;

@RestController
@RequestMapping("/room")
public class roomController {

    @Autowired
    private Service service;

    @RequestMapping("join/{roomid}")
    public ResponseEntity<String> join(
            @PathVariable String roomid,
            @SessionAttribute("player") Player player
    ) {
        service.AddPlayerToRoom(Integer.parseInt(roomid),player);
        return ResponseEntity.ok("Joined" + roomid);
    }

    @RequestMapping("leave/{roomid}")
    public ResponseEntity<String> leave(
            @PathVariable String roomid,
            @SessionAttribute("player") Player player
    ){
        service.RemovePlayerFromRoom(Integer.parseInt(roomid),player);
        return ResponseEntity.ok("Removed" + roomid);
    }
}
