package org.example.buckshot_roulette.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.example.buckshot_roulette.model.Player;

import java.util.List;

@Getter
@Setter
@Builder
public class RoomStatusResponse {
    private String status;
    private String message;  // Thông báo chung trong phòng
    private int roomid;
    private int[] gun;
    private List<Player> players;
    private Player nextPlayer;
    private Boolean isSoloMode;
    private ActionResponse actionResponse;
}
