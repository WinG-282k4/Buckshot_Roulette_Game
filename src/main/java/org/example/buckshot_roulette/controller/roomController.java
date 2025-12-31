package org.example.buckshot_roulette.controller;

import org.example.buckshot_roulette.dto.ActionResult;
import org.example.buckshot_roulette.dto.RoomStatusResponse;
import org.example.buckshot_roulette.model.Player;
import org.example.buckshot_roulette.model.Room;
import org.example.buckshot_roulette.model.RoomLoby;
import org.example.buckshot_roulette.service.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;
import java.util.Map;

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
    public ActionResult join(
            @DestinationVariable String roomid,
            SimpMessageHeaderAccessor headerAccessor
    ) {
        Player player = null;

        // Thử lấy player từ session trước
        Map<String, Object> sessionAttributes = headerAccessor.getSessionAttributes();
        if (sessionAttributes != null) {
            player = (Player) sessionAttributes.get("player");
        }

        if(player == null){
            return ActionResult.builder()
                    .isSuccess(false)
                    .message("Player not found in session")
                    .data(null)
                    .build();
        }


        logger.info("Received API: WebSocket /app/join/{} by player {} (name={})", roomid, player.getId(), player.getName());
        return service.AddPlayerToRoom(Integer.parseInt(roomid), player);
    }

    @MessageMapping("leave/{roomid}")
    @SendTo("/topic/room/{roomid}")
    public ActionResult leave(
            @DestinationVariable String roomid,
            @Payload Map<String, String> payload,
            SimpMessageHeaderAccessor headerAccessor
    ){
        Player player = null;

        //Lấy player từ session trước
        Map<String, Object> sessionAttributes = headerAccessor.getSessionAttributes();
        if (sessionAttributes != null) {
            player = (Player) sessionAttributes.get("player");
        }


        if (player == null) {
            logger.error("Cannot determine player for leave request");
            return ActionResult.builder()
                    .isSuccess(false)
                    .message("Player not found in session")
                    .data(null)
                    .build();
        }

        logger.info("Received API: WebSocket /app/leave/{} by player {} (name={})", roomid, player.getId(), player.getName());
        return service.RemovePlayerFromRoom(Integer.parseInt(roomid), player);
    }

    @GetMapping("/api/rooms/{roomid}")
    public ResponseEntity<RoomStatusResponse> getRoomById(
            @PathVariable int roomid
    ) {
        logger.info("Received API: GET /api/rooms/{} (get room by ID)", roomid);
        Room room = service.getRoom(roomid);
        return ResponseEntity.ok(room.toRoomStatus(""));
    }

    @GetMapping("/api/rooms/list/{page}")
    public ResponseEntity<List<RoomLoby>> getAllRooms(
            @PathVariable int page
    ) {
        logger.info("Received API: GET /api/rooms/list/{} (get room list)", page);
        List<RoomLoby> room = service.getAnyRoom(page);
        return ResponseEntity.ok(room);
    }
}
