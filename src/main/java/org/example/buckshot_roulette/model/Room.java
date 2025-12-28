package org.example.buckshot_roulette.model;

import lombok.Getter;
import lombok.Setter;
import org.example.buckshot_roulette.dto.IRoomAction;
import org.example.buckshot_roulette.dto.RoomStatusResponse;
import tools.jackson.databind.annotation.JsonSerialize;
import tools.jackson.databind.ser.std.ToStringSerializer;

import java.util.LinkedList;
import java.util.List;
import java.util.Objects;
import java.util.Queue;

@Setter
@Getter
public class Room implements IRoomAction {

    @JsonSerialize(using = ToStringSerializer.class)
    private int ID;
    private List<Player> players;
    private Queue<Player> turnOrder;
    private Queue<Player> SoloTurnOrder;
    private Gun gun;
    private Boolean isSoloMode;

    public Room(int ID) {
        this.ID = ID;
        this.isSoloMode = false;
        this.players = new LinkedList<Player>();
        this.gun = new Gun();
        this.turnOrder = new LinkedList<Player>();
        this.SoloTurnOrder = new LinkedList<>();
    }

    //Method
    @Override
    public void setSoloMode(boolean isSolo, String playerIdActor, String playerTargetId) {
        if (Objects.equals(playerIdActor, playerTargetId)) {
            throw new IllegalArgumentException("Can not solo against yourself");
        }
        this.isSoloMode = isSolo;
        this.SoloTurnOrder = new LinkedList<Player>();
        for (Player p : this.turnOrder) {
            if (Objects.equals(p.getId(), playerIdActor) || Objects.equals(p.getId(), playerTargetId)) {
                p.setIsSoloing(true);
                this.SoloTurnOrder.add(p);
            }
        }
    }

    //Create turn order
    public void setTurnOrder() {
        int randomStartPlayerIndex = (int) (Math.random() * this.players.size());
        Player player = this.players.get(randomStartPlayerIndex);
        this.turnOrder = new LinkedList<Player>();
        this.turnOrder.addAll(this.players);

        for (Player p : this.players) {
            assert turnOrder.peek() != null;
            if (!Objects.equals(turnOrder.peek().getId(), player.getId())) {
                Player pollplayer = turnOrder.poll();
                turnOrder.add(pollplayer);
            }else break;
        }
    }

    //Get player on room
    public Player getPlayer(String playerId){
        for (Player p : this.players) {
            if (Objects.equals(p.getId(), playerId)) {
                return p;
            }
        }
        return null;
    }

    //Next turn after player action
    public void endAction() {
        // 1. Determine current queue based on mode
        Queue<Player> currentQueue = this.isSoloMode ? this.SoloTurnOrder : this.turnOrder;

        // 2. Check if currentQueue is empty
        if (currentQueue == null || currentQueue.isEmpty()) {
            System.out.println("Lỗi: Hàng đợi không có người chơi!");
            return;
        }

        // 3. Poll and add back the current player
        Player pollplayer = currentQueue.poll();
        if (pollplayer != null) {
            currentQueue.add(pollplayer);
        }

        // 4. Check next player
        Player nextPlayer = currentQueue.peek();

        // if nextPlayer is null, return
        if (nextPlayer == null) return;

        // 5. Check if next player can action
        if (!nextPlayer.canAction()) {
            this.endAction();
        }
    }

    //Check target player is soloing
    public Boolean isSolo(String playerId){
        if(!this.isSoloMode) return false;
        for (Player p : this.SoloTurnOrder) {
            if (Objects.equals(p.getId(), playerId)) {
                return true;
            }
        }
        return false;
    }

    public void Print(){
        System.out.println(players);
        if(this.isSoloMode){
            System.out.println("Solo Turn Order:" + this.SoloTurnOrder);
        } else
            System.out.println("Turn Order:" + this.turnOrder);
        System.out.printf("Gun Bullets: " + this.gun.getBullets() + "\n");
        System.out.println("Players in Room:");
        for (Player p : players) {
            System.out.printf("Player Name: %s, Health: %d, Items: %s\n", p.getName(), p.getHealth(), p.getItems());
        }
    }

    //Get next player
    public Player getNextPlayer(){
        if (this.turnOrder != null && !this.turnOrder.isEmpty()) {
            return this.turnOrder.peek();
        }

        if(this.isSoloMode){
            if (this.SoloTurnOrder != null && !this.SoloTurnOrder.isEmpty()){
                return this.SoloTurnOrder.peek();
            }
        }

        return null;
    }

    //Check room status
    public String checkStatus(){

        String status;

        // Check if game has ended (only 1 or fewer players alive)
        int aliveCount = 0;
        for(Player p : this.players){
            if(p.getHealth() > 0){
                aliveCount++;
            }
        }

        if(aliveCount <= 1){
            status = "Ended";
            return status;
        }

        // If nextPlayer exists, game is playing
        if (getNextPlayer() != null){
            status = "Playing";
        }
        else {
            // No nextPlayer and game not ended = waiting
            status = "Waiting";
        }

        return status;
    }

    //Convert to Response
    public RoomStatusResponse toRoomStatus(String message){

        // Use peek() instead of poll() to avoid removing player from the queue when just reporting nextPlayer
        Player nextPlayer = getNextPlayer();

        String status = this.checkStatus();

        return RoomStatusResponse.builder()
                .status(status)
                .message(message)  // Thêm message
                .roomid(this.getID())
                .gun(this.getGun().getInfoBullets())
                .players(this.getPlayers())
                .nextPlayer(nextPlayer)
                .isSoloMode(this.getIsSoloMode())
                .build();
    }
}
