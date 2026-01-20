package org.example.buckshot_roulette.controller;

import jakarta.servlet.http.HttpSession;
import org.example.buckshot_roulette.dto.ActionResult;
import org.example.buckshot_roulette.dto.RoomLoby;
import org.example.buckshot_roulette.dto.RoomStatusResponse;
import org.example.buckshot_roulette.model.Player;
import org.example.buckshot_roulette.model.Room;
import org.example.buckshot_roulette.service.Service;
import org.example.buckshot_roulette.service.playerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/room")
public class roomController {

    // Logger for incoming APIs
    private static final Logger logger = LoggerFactory.getLogger(roomController.class);

    @Autowired
    private Service service;

    @Autowired
    private playerService playerservice;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @PostMapping("/createroom")
    public ResponseEntity<String> createRoom(
            HttpSession session
    ) {

        Player player =(Player) session.getAttribute("player");

        player = playerservice.getPlayerById(player.getId());
        if(player == null){
            return ResponseEntity.badRequest().body("Player not found in session");
        }

        if(player.getIsInRoom()){
            return ResponseEntity.badRequest().body("Player is already in a room");
        }
        logger.info("Received API: POST /room/createroom");
        int roomid = service.CreaterRoom(player.getId());
        return ResponseEntity.ok("Room created with ID: " + roomid);
    }

    @MessageMapping("join/{roomid}")
    @SendTo("/topic/room/{roomid}")
    public RoomStatusResponse join(
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
            return null;
        }

        logger.info("Received API: WebSocket /app/join/{} by player {} (name={})", roomid, player.getId(), player.getName());
        ActionResult result = service.AddPlayerToRoom(Integer.parseInt(roomid), player);

        // If join successful, broadcast room status
        if (result.getIsSuccess()) {
            Room room = service.getRoom(Integer.parseInt(roomid));
            if (room != null) {
//                sessionAttributes.put("roomid", room.getID()); // Lưu roomid vào session
                return room.toRoomStatus("");
            }
        }

        return null;
    }

    @MessageMapping("leave/{roomid}")
    public void leave(
            @DestinationVariable String roomid,
            SimpMessageHeaderAccessor headerAccessor
    ){
        Player player = null;

        // Lấy player từ session
        Map<String, Object> sessionAttributes = headerAccessor.getSessionAttributes();
        if (sessionAttributes != null) {
            player = (Player) sessionAttributes.get("player");
        }

        if (player == null) {
            logger.error("Cannot determine player for leave request");
            return;
        }

        logger.info("Received API: WebSocket /app/leave/{} by player {} (name={})", roomid, player.getId(), player.getName());

        ActionResult result;
        try {
            result = service.RemovePlayerFromRoom(Integer.parseInt(roomid), player);
        } catch (IllegalArgumentException e) {
            // Room not found (already deleted)
            logger.warn("Room {} already deleted or not found", roomid);
            result = ActionResult.builder()
                    .isSuccess(true) // Still consider it success since player is not in room anyway
                    .message("Room already deleted")
                    .data(null)
                    .build();
        }

        // Send ActionResult trực tiếp tới player (để xác nhận thành công/thất bại)
        messagingTemplate.convertAndSendToUser(
                player.getId(),
                "/topic/leave-result",
                result
        );

        // Nếu rời thành công, broadcast room status mới cho những player khác còn lại
        if (result.getIsSuccess()) {
            Room room = service.getRoom(Integer.parseInt(roomid));
            if (room != null) {
//                sessionAttributes.remove("roomid"); // Xoá roomid khỏi session
                messagingTemplate.convertAndSend(
                        "/topic/room/" + roomid,
                        room.toRoomStatus("")
                );
            }
        }
    }

    @GetMapping("/{roomid}")
    public ResponseEntity<RoomStatusResponse> getRoomById(
            @PathVariable int roomid
    ) {
        logger.info("Received API: GET /rooms/{} (get room by ID)", roomid);
        Room room = service.getRoom(roomid);

        if (room == null) {
            logger.warn("Room {} not found", roomid);
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(room.toRoomStatus(""));
    }

    @GetMapping("/list/{page}")
    public ResponseEntity<List<RoomLoby>> getAllRooms(
            @PathVariable int page,
            HttpSession session
    ) {
        if (session == null) { return ResponseEntity.notFound().build(); }
        logger.info("Received API: GET /rooms/list/{} (get room list)", page);
        List<RoomLoby> rooms = service.getAnyRoom(page);
        return ResponseEntity.ok(rooms);
    }
}
