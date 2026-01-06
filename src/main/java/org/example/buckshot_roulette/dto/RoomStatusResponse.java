package org.example.buckshot_roulette.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.example.buckshot_roulette.model.Player;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Builder
public class RoomStatusResponse {
    private String status;
    private String message;  // Thông báo chung trong phòng
    private String ownerid;
    private int roomid;
    private int[] gun;
    private List<PlayerResponseDTO> players;
    private PlayerResponseDTO nextPlayer;
    private Boolean isSoloMode;
    private ActionResponse actionResponse;

    /**
     * Convert players list from Player model to PlayerResponseDTO
     */
    public static RoomStatusResponse fromGameRoom(
            String status,
            String message,
            int roomid,
            int[] gun,
            List<Player> playerList,
            Player nextPlayer,
            Boolean isSoloMode,
            String ownerid,
            ActionResponse actionResponse) {

        List<PlayerResponseDTO> playerDTOs = playerList.stream()
                .map(PlayerResponseDTO::fromPlayer)
                .collect(Collectors.toList());

        PlayerResponseDTO nextPlayerDTO = nextPlayer != null ? PlayerResponseDTO.fromPlayer(nextPlayer) : null;

        return RoomStatusResponse.builder()
                .status(status)
                .message(message)
                .roomid(roomid)
                .gun(gun)
                .players(playerDTOs)
                .nextPlayer(nextPlayerDTO)
                .isSoloMode(isSoloMode)
                .ownerid(ownerid)
                .actionResponse(actionResponse)
                .build();
    }
}
