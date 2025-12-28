package org.example.buckshot_roulette.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class RoomLoby {
    private int roomid;
    private String status;

    public RoomLoby(int roomid, String status){
        this.roomid = roomid;
        this.status = status;
    }
}
