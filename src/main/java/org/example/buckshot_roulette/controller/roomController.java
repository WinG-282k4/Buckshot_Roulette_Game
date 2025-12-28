package org.example.buckshot_roulette.controller;

import org.example.buckshot_roulette.dto.RoomStatusResponse;
import org.example.buckshot_roulette.model.Player;
import org.example.buckshot_roulette.model.Room;
import org.example.buckshot_roulette.service.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Controller
public class roomController {

    // Logger for incoming APIs
    private static final Logger logger = LoggerFactory.getLogger(roomController.class);

    @Autowired
    private Service service;

    @PostMapping("/api/createroom")
    public ResponseEntity<String> createRoom() {
        logger.info("Received API: POST /api/createroom");
        int roomid = service.CreaterRoom();
        return ResponseEntity.ok("Room created with ID: " + roomid);
    }

    @MessageMapping("join/{roomid}")
    @SendTo("/topic/room/{roomid}")
    public Map<String, String> join(
            @DestinationVariable String roomid,
            SimpMessageHeaderAccessor headerAccessor
    ) {
        Player player = (Player) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("player");
        logger.info("Received API: WebSocket /app/join/{} by player {} (name={})", roomid, player != null ? player.getId() : "unknown", player != null ? player.getName() : "unknown");
        service.AddPlayerToRoom(Integer.parseInt(roomid),player);
        // Trả về Map để có định dạng JSON chuẩn: {"message": "Thanh Joined 1"}
        Map<String, String> response = new HashMap<>();
        response.put("message", player.getName() + " Joined " + roomid);
        return response;
    }

    @MessageMapping("leave/{roomid}")
    @SendTo("/topic/room/{roomid}")
    public Map<String, String> leave(
            @DestinationVariable String roomid,
            SimpMessageHeaderAccessor headerAccessor
    ){
        Player player = (Player) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("player");
        logger.info("Received API: WebSocket /app/leave/{} by player {} (name={})", roomid, player != null ? player.getId() : "unknown", player != null ? player.getName() : "unknown");
        service.RemovePlayerFromRoom(Integer.parseInt(roomid),player);

        // Trả về Map để có định dạng JSON chuẩn: {"message": "Thanh Joined 1"}
        Map<String, String> response = new HashMap<>();
        response.put("message", player.getName() + " removed " + roomid);
        return response;
    }

    @GetMapping("/api/rooms/{roomid}")
    public ResponseEntity<RoomStatusResponse> getRooms(
            @PathVariable int roomid
    ) {
        logger.info("Received API: GET /api/rooms");
        Room room = service.getRoom(roomid);
        return ResponseEntity.ok(room.getRoomStatus());
    }

    @GetMapping("/api/rooms/{page}")
    public ResponseEntity<List<Integer>> getAllRooms(
            @PathVariable int page
    ) {
        logger.info("Received API: GET /api/rooms");
        List<Integer> room = service.getAnyRoom(page);
        return ResponseEntity.ok(room);
    }
}
