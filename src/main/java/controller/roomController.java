package controller;

import model.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import service.Service;

import java.util.Objects;

@Controller
public class roomController {

    @Autowired
    private Service service;

    @MessageMapping("join/{roomid}")
    @SendTo("/topic/room/{roomid}")
    public ResponseEntity<String> join(
            @DestinationVariable String roomid,
            SimpMessageHeaderAccessor headerAccessor
    ) {
        Player player = (Player) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("player");
        service.AddPlayerToRoom(Integer.parseInt(roomid),player);
        return ResponseEntity.ok(player.getName() + "Joined" + roomid);
    }

    @MessageMapping("leave/{roomid}")
    @SendTo("/topic/room/{roomid}")
    public ResponseEntity<String> leave(
            @DestinationVariable String roomid,
            SimpMessageHeaderAccessor headerAccessor
    ){
        Player player = (Player) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("player");
        service.RemovePlayerFromRoom(Integer.parseInt(roomid),player);
        return ResponseEntity.ok(player.getName() + "Removed" + roomid);
    }
}
