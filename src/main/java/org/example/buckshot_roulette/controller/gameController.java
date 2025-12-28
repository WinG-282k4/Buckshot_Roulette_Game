package org.example.buckshot_roulette.controller;

import org.example.buckshot_roulette.dto.ActionResponse;
import org.example.buckshot_roulette.dto.RoomStatusResponse;
import org.example.buckshot_roulette.dto.itemRequest;
import org.example.buckshot_roulette.model.Player;
import org.example.buckshot_roulette.model.Room;
import org.example.buckshot_roulette.service.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Controller
public class gameController {

    // Logger for incoming API logs
    private static final Logger logger = LoggerFactory.getLogger(gameController.class);

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    //Handling logic game
    @Autowired
    private Service service;

    @MessageMapping("/room/{roomid}/startgame")
    public void StartGame(
            @DestinationVariable String roomid
    ){
        logger.info("Received API: POST /app/room/{}/startgame", roomid);
        //Call server to handle logic
        RoomStatusResponse room = service.StartGame(Integer.parseInt(roomid));

        //Build action response to notify
        room.setActionResponse(ActionResponse.builder()
                .action("START")
                .build());

        sendResults(room);
    }

    @MessageMapping("/room/{roomid}/fire/{targetplayerid}")
    public void fire(
            @DestinationVariable String roomid,
            @DestinationVariable String targetplayerid,
            SimpMessageHeaderAccessor headerAccessor
    ){
        //Log incoming API and actor
        Player actorPlayer = (Player) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("player");
        logger.info("Received API: POST /app/room/{}/fire/{} by actor {}", roomid, targetplayerid, actorPlayer != null ? actorPlayer.getId() : "unknown");

        //Call server to handle logic
        assert actorPlayer != null;
        RoomStatusResponse room = service.PlayerFireTarget(
                Integer.parseInt(roomid),
                actorPlayer.getId(),
                targetplayerid
        );

        //Build action response to notify
        room.setActionResponse(ActionResponse.builder()
                        .actorId(actorPlayer.getId())
                        .targetid(targetplayerid)
                        .action("FIRE")
                        .build());
        sendResults(room);
    }

    @MessageMapping("/room/{roomid}/use-item")
    public void useItem(
            @DestinationVariable String roomid,
            @Payload itemRequest payload,
            SimpMessageHeaderAccessor headerAccessor
    ){

        //Log incoming API
        Player actorPlayer = (Player) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("player");
        logger.info("Received API: POST /app/room/{}/use-item by actor {} target {} type {}", roomid, actorPlayer != null ? actorPlayer.getId() : "unknown", payload != null ? payload.getTargetid() : "null", payload != null ? payload.getTypeitem() : "null");

        //Call server to handle logic
        assert actorPlayer != null;
        assert payload != null;
        RoomStatusResponse room = service.PlayerUseItem(
                Integer.parseInt(roomid),
                actorPlayer.getId(),
                payload.getTargetid(),
                payload.getTypeitem());

        //Build action response to notify
        room.setActionResponse(ActionResponse.builder()
                .actorId(actorPlayer.getId())
                .action("USE-ITEM")
                .targetid(payload.getTargetid())
                .build());

        //Send result
        sendResults(room);
    }

    @MessageMapping("/room/{roomid}/target/{targetplayerid}")
    //This endpoint makes player in the room know who is targeted
    public void target(
            @DestinationVariable String roomid,
            @DestinationVariable String targetplayerid,
            SimpMessageHeaderAccessor headerAccessor
    ){

        Player actorPlayer = (Player) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("player");
        logger.info("Received API: POST /app/room/{}/target/{} by actor {}", roomid, targetplayerid, actorPlayer != null ? actorPlayer.getId() : "unknown");
        Room room = service.getRoom(Integer.parseInt(roomid));

        //Create status room to response
        RoomStatusResponse sRoom = room.toRoomStatus("");
        sRoom.setActionResponse(ActionResponse.builder()
                .actorId(actorPlayer.getId())
                .action("TARGET")
                .targetid(targetplayerid
                )
                .build()
        );

        sendResults(sRoom);
    }

    //Send a result to who need
    private void sendResults(RoomStatusResponse result) {

        //Send it to who join room
        String destination = "/topic/room/" + result.getRoomid();

        // Log broadcast (null-safe for action)
        String action = (result.getActionResponse() != null) ? result.getActionResponse().getAction() : "";
        logger.info("Broadcasting to {} (room={}): action={}", destination, result.getRoomid(), action);

        // A. Send payload to all players in the room
        messagingTemplate.convertAndSend(destination, result);

        // B. Send payload to notify a victim
        String targetId = result.getActionResponse().getTargetid();

        // if NULL or empty, skip sending victim notification
        if (targetId == null || targetId.isEmpty()) {
            System.out.println("ID target không tồn tại! (Bỏ qua vì không cần thiết thông báo");
            return;
        }
        String victimid = result.getActionResponse().getTargetid();
        String action2 = result.getActionResponse().getAction();

        Map<String, String> alert = new HashMap<>();
        alert.put("type", action2);
        alert.put("msg", "You were hit by " + result.getActionResponse().getActorId());

        // Only victim sees efect
        messagingTemplate.convertAndSendToUser(victimid, "/topic/event", alert);
    }
}
