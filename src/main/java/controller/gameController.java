package controller;

import dto.ActionResponse;
import dto.RoomStatusResponse;
import dto.itemRequest;
import model.Player;
import model.Room;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import service.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Controller
public class gameController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    //Handling logic game
    @Autowired
    private Service service;

    @MessageMapping("/room/{roomid}/startgame")
    public void StartGame(
            @DestinationVariable String roomid
    ){
        //Call server to handle logic
        RoomStatusResponse room = service.StartGame(Integer.parseInt(roomid));

        //Build action response to notify
        room.setActionResponse(ActionResponse.builder()
                .action("START")
                .build());

        sendResults(room);
    }

    @MessageMapping("/room/{roomid}/reload")
    public void reloadRoom(
            @DestinationVariable String roomid
    ){
        //Call server to handle logic
        RoomStatusResponse room = service.nextRound(Integer.parseInt(roomid));

        //Build action response to notify
        room.setActionResponse(ActionResponse.builder()
                .action("RELOAD")
                .build());

        sendResults(room);
    }

    @MessageMapping("/room/{roomid}/fire/{targetplayerid}")
    public void fire(
            @DestinationVariable String roomid,
            @DestinationVariable String targetplayerid,
            SimpMessageHeaderAccessor headerAccessor
    ){
        //Call server to handle logic
        Player actorPlayer = (Player) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("player");
        RoomStatusResponse room = service.PlayerFireTarget(
                Integer.parseInt(roomid),
                actorPlayer.getId(),
                Long.parseLong(targetplayerid)
        );

        //Build action response to notify
        room.setActionResponse(ActionResponse.builder()
                        .actorId(actorPlayer.getId().toString())
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

        //Call server to handle logic
        Player actorPlayer = (Player) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("player");
        RoomStatusResponse room = service.PlayerUseItem(
                Integer.parseInt(roomid),
                actorPlayer.getId(),
                payload.getTargetid(),
                payload.getTypeitem());

        //Build action response to notify
        room.setActionResponse(ActionResponse.builder()
                .actorId(actorPlayer.getId().toString())
                .action("USE-ITEM")
                .targetid(payload.getTargetid().toString())
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
        Room room = service.getRoom(Integer.parseInt(roomid));

        //Create status room to response
        RoomStatusResponse sRoom = room.getRoomStatus();
        sRoom.setActionResponse(ActionResponse.builder()
                .actorId(actorPlayer.getId().toString())
                .action("TARGET")
                .targetid(targetplayerid)
                .build()
        );

        sendResults(sRoom);
    }

    //Send a result to who need
    private void sendResults(RoomStatusResponse result) {

        //Send it to who join room
        String destination = "/topic/room/" + result.getRoomid();

        // A. Send payload to all players in the room
        messagingTemplate.convertAndSend(destination, result);

        // B. Send payload to notify a victim
        if (result.getActionResponse().getTargetid() == null) { return;}
        String victimid = result.getActionResponse().getTargetid();
        String action = result.getActionResponse().getAction();

        Map<String, String> alert = new HashMap<>();
        alert.put("type", action);
        alert.put("msg", "You were hit by " + result.getActionResponse().getActorId());

        // Only victim sees efect
        messagingTemplate.convertAndSendToUser(victimid, "/topic/event", alert);
    }
}
