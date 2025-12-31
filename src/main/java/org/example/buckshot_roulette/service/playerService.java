package org.example.buckshot_roulette.service;

import org.example.buckshot_roulette.dto.ActionResult;
import org.example.buckshot_roulette.model.Player;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class playerService {

    private static List<Player> playerList;

    public playerService() {this.playerList = new ArrayList<Player>();}

    //Get player of id
    public Player getPlayerById(String id) {
        for (Player player : playerList) {
            if (player.getId().equals(id)) {
                return player;
            }
        }
        return null;
    }

    //Update avatar of player
    public ActionResult updatePlayerAvatar(String id, String avatar) {
        Player player = getPlayerById(id);
        if (player != null) {
            player.setURLavatar(avatar);
//            System.out.println("<UNK> <UNK> <UNK> <UNK> <UNK> <UNK> <UNK> <UNK>");
//            System.out.println("Avatar current: "+ player.getURLavatar());
            return ActionResult.builder()
                    .isSuccess(true)
                    .message("Avatar updated successfully")
                    .data(player)
                    .build();
        } else return ActionResult.builder()
                .isSuccess(false)
                .message("Player not found")
                .data(player)
                .build();
    }

    //Crate new player
    public ActionResult createPlayer(String name) {
        for (Player player : playerList) {
            if (player.getName().equals(name)) {
                return ActionResult.builder()
                        .isSuccess(false)
                        .message("Player name already exists")
                        .data(player)
                        .build();
            }
        }
        Player newPlayer = new Player(name);
        this.playerList.add(newPlayer);
        return ActionResult.builder()
                .isSuccess(true)
                .message("Player created successfully with ID: " + newPlayer.getId())
                .data(newPlayer)
                .build();
    }

    //Remove player
    public void removePlayer(String id) {
        Player player = getPlayerById(id);
        if (player != null) {
            playerList.remove(player);
        }
    }
}
