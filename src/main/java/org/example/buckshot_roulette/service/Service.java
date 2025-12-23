package service;

import dto.GameActionContext;
import dto.RoomStatusResponse;
import model.Item.Item;
import model.ItemFactory;
import model.Player;
import model.Room;

import java.util.List;
import java.util.Objects;

@org.springframework.stereotype.Service
public class Service {
    public List<Room> rooms;
    public List<Player> players;

    public Service() {
        rooms = new java.util.ArrayList<Room>();
    }

    //Get rooms
    public Room getRoom(int roomid) {
        for(Room r : rooms){
            if(r.getID() == roomid){
                return r;
            }
        }
        return null;
    }

    //Start Game
    public RoomStatusResponse StartGame(int roomid){
        Room tempRoom = getRoom(roomid);

        if(tempRoom == null){
            throw new IllegalArgumentException("Room not found");
        }

        tempRoom.setTurnOrder();

        int PlayerCount = tempRoom.getPlayers().size();
        tempRoom.getGun().reload(PlayerCount);

        for(Player p : tempRoom.getPlayers()){
            p.getItems().clear();
            p.CreateStarterItems();
        }

        return tempRoom.getRoomStatus();
    }

    //Create new Room
    public int CreaterRoom(){
        int NewRoomID = rooms.size() + 1;
        Room room = new Room(NewRoomID);
        rooms.add(room);
        return room.getID();
    }

    //Player join Room
    public void AddPlayerToRoom(int roomid, Player player){
        Room tempRoom = getRoom(roomid);

        if(tempRoom == null){
            throw new IllegalArgumentException("Room not found");
        }

        tempRoom.getPlayers().add(player);

    }

    //Player leave Room
    public RoomStatusResponse RemovePlayerFromRoom(int roomid, Player player){
        Room tempRoom = getRoom(roomid);

        if(tempRoom == null){
            throw new IllegalArgumentException("Room not found");
        }

        tempRoom.getPlayers().remove(player);//Reset player ID to indicate they are no longer in a room
        return tempRoom.getRoomStatus();
    }

    //Player use item
    public RoomStatusResponse PlayerUseItem(int roomid, Long playeridActor, Long playerIDtarget, int typeItem){

        Room tempRoom = getRoom(roomid);

        if(tempRoom == null){
            throw new IllegalArgumentException("Room not found");
        }

        Player tempPlayerActor = tempRoom.getPlayer(playeridActor);
        Player tempPlayerTarget = tempRoom.getPlayer(playerIDtarget);

        if(tempPlayerActor == null || tempPlayerTarget == null){
            throw new IllegalArgumentException("Player not found in room");
        }

        Item useItem = tempPlayerActor.getItem(ItemFactory.createItem(typeItem).getClass());
        if(useItem == null){
            throw new IllegalArgumentException("Item not found in player inventory");
        }

        //Check turn can action
        if (!checkCurrentTurn(roomid, playeridActor) && !tempPlayerActor.canAction()) {
            throw new IllegalArgumentException("You have handcuffed and cannot perform actions this turn." + tempPlayerActor.isHandcuffed());
        }

        //Check solomode
        if(tempRoom.getIsSoloMode() && !useItem.isTargetNulltable()){
            if(!tempRoom.isSolo(playerIDtarget)) // check target is soloing
                throw new IllegalArgumentException("Target is not solo.");
        }

        useItem.use(new GameActionContext(tempRoom.getGun(), tempPlayerActor, tempPlayerTarget, tempRoom));
        tempPlayerActor.getItems().remove(useItem);
        System.out.println("Player " + useItem.getName() + " has been used");
        return tempRoom.getRoomStatus();
    }

    //Player fire target
    public RoomStatusResponse PlayerFireTarget(int roomid, Long playeridActor, Long playeridTarget) {
        Room tempRoom = getRoom(roomid);
//        System.out.println(tempRoom.getID());
        if (tempRoom == null) {
            throw new IllegalArgumentException("Room not found");
        }

        Player tempPlayerActor = tempRoom.getPlayer(playeridActor);
        Player tempPlayerTarget = tempRoom.getPlayer(playeridTarget);

//        System.out.println(tempPlayerActor.getID() + " " + tempPlayerTarget.getID());

        if (tempPlayerActor == null || tempPlayerTarget == null) {
            throw new IllegalArgumentException("Player not found in room");
        }

        //Check turn can action
        if(!checkCurrentTurn(roomid, playeridActor) && !tempPlayerActor.canAction()){
            throw new IllegalArgumentException("You have handcuffed and cannot perform actions this turn.");
        }

        //Check solomode
        if(tempRoom.getIsSoloMode()){
            if(!tempRoom.isSolo(playeridTarget))
                throw new IllegalArgumentException("Target is not solo.");
        }

        int dmg = tempRoom.getGun().fire();

        if(dmg > 0 && tempRoom.getIsSoloMode()){
            tempPlayerActor.setHealth(tempPlayerActor.getHealth() + 1);
            tempRoom.setSoloMode(false);
            for(Player p : tempRoom.getPlayers()){
                p.setIsSoloing(false);
            }
        } //If having damage, end solo mode

        System.out.println(dmg);
        tempPlayerTarget.setHealth(tempPlayerTarget.getHealth() - dmg);
        if(!Objects.equals(playeridActor, playeridTarget)){
            tempRoom.endAction();
            System.out.println("END ACTION");
        }
        else if (dmg != 0) tempRoom.endAction();

        return tempRoom.getRoomStatus();
    }

    //End round
    public RoomStatusResponse nextRound(int roomid){
        Room tempRoom = getRoom(roomid);

        if(tempRoom == null){
            throw new IllegalArgumentException("Room not found");
        }

        tempRoom.getGun().reload(tempRoom.getPlayers().size());

        for(Player p : tempRoom.getPlayers()){
            p.CreateStarterItems();
        }
        return tempRoom.getRoomStatus();
    }


    //Check turn belong someone
    public Boolean checkCurrentTurn(int roomid, Long playerid){

        Room tempRoom = getRoom(roomid);
        Player tempPlayer = tempRoom.getPlayer(playerid);

        return tempRoom.getTurnOrder().peek() == tempPlayer;
    }
}

