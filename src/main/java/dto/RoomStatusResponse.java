package dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import model.Player;

import java.util.List;

@Getter
@Setter
@Builder
public class RoomStatusResponse {
    private int roomid;
    private int[] gun;
    private List<Player> players;
    private Player nextPlayer;
    private Boolean isSoloMode;
}
