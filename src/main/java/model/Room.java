package model;

import dto.IRoomAction;
import lombok.Getter;
import lombok.Setter;

import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

@Setter
@Getter
public class Room implements IRoomAction {

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
    }

    public Boolean getSoloMode() {
        return isSoloMode;
    }

    public void setSoloMode(Boolean soloMode) {
        isSoloMode = soloMode;
    }

    //Method
    @Override
    public void setSoloMode(boolean isSolo, int playerIdActor, int playerTargetId) {
        if ( playerIdActor == playerTargetId) {
            throw new IllegalArgumentException("Can not solo against yourself");
        }
        this.isSoloMode = isSolo;
        this.SoloTurnOrder = new LinkedList<Player>();
        for (Player p : this.turnOrder) {
            if (p.getId() == playerIdActor || p.getId() == playerTargetId) {
                this.SoloTurnOrder.add(p);
            }
        }
    }

    //Create turn order
    public void setTurnOrder() {
        int randomStartPlayerIndex = (int) (Math.random() * this.players.size());
        this.turnOrder = new LinkedList<Player>();
        for (Player p : this.players) {
            this.turnOrder.add(p);
        }

        for (Player p : this.players) {
            if (turnOrder.peek().getId() != randomStartPlayerIndex) {
                Player pollplayer = turnOrder.poll();
                turnOrder.add(pollplayer);
            }else break;
        }
    }

    //Get player on room
    public Player getPlayer(int playerId){
        for (Player p : this.players) {
            if (p.getId() == playerId) {
                return p;
            }
        }
        return null;
    }

    //Next turn after player action
    public void endAction(){
        if(this.isSoloMode){
            Player pollplayer = this.SoloTurnOrder.poll();
            this.SoloTurnOrder.add(pollplayer);

        } else {
            Player pollplayer = this.turnOrder.poll();
            this.turnOrder.add(pollplayer);
        }

        //Check next player can action
        Player nextPlayer = this.turnOrder.peek();
        if(!nextPlayer.canAction()) this.endAction();
    }

    //Check target player is soloing
    public Boolean isSolo(int playerId){
        if(!this.isSoloMode) return false;
        for (Player p : this.SoloTurnOrder) {
            if (p.getId() == playerId) {
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
}
