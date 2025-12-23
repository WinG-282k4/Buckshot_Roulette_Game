package controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import service.Service;

@Controller
public class gameController {

    //Handling logic game
    @Autowired
    private Service service;

    @MessageMapping("startgame/{roomid}")
    public ResponseEntity<String> StartGame(
            @PathVariable String roomid
    ){
        service.StartGame(Integer.parseInt(roomid));
        return ResponseEntity.ok("Started" + roomid);
    }


}
