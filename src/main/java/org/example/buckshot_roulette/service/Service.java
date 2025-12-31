package org.example.buckshot_roulette.service;

import org.example.buckshot_roulette.dto.GameActionContext;
import org.example.buckshot_roulette.dto.RoomStatusResponse;
import org.example.buckshot_roulette.dto.UseItemRessult;
import org.example.buckshot_roulette.model.Item.Item;
import org.example.buckshot_roulette.model.ItemFactory;
import org.example.buckshot_roulette.model.Player;
import org.example.buckshot_roulette.model.Room;
import org.example.buckshot_roulette.model.RoomLoby;

import java.util.ArrayList;
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

        System.out.println("Room infor at start game:");
        tempRoom.Print();

        return tempRoom.toRoomStatus("Game has started!");
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

        // Check if player with same ID already in room (important for reload scenario)
        Player existingPlayer = tempRoom.getPlayer(player.getId());
        if (existingPlayer != null) {
            // Player with same ID already exists - replace the old object with new one
            // This handles the reload case where new Player object is created with same ID
            System.out.println("Player " + player.getName() + " (ID: " + player.getId() + ") already in room, updating reference");
            tempRoom.getPlayers().remove(existingPlayer);
            tempRoom.getPlayers().add(player);
            return;
        }

        // Check if room is full
        if (tempRoom.getPlayers().size() >= 4) {
            throw new IllegalArgumentException("Room is full (max 4 players)");
        }

        // Check if game already started (turnOrder has been set)
        if (tempRoom.getTurnOrder().peek() != null) {
            throw new IllegalArgumentException("Game has already started, cannot join");
        }

        tempRoom.getPlayers().add(player);
        System.out.println("Player " + player.getName() + " (ID: " + player.getId() + ") joined room " + roomid);
    }

    //Player leave Room
    public RoomStatusResponse RemovePlayerFromRoom(int roomid, Player player){
        Room tempRoom = getRoom(roomid);

        if(tempRoom == null){
            throw new IllegalArgumentException("Room not found");
        }

        // Remove player by ID instead of object reference
        Player playerToRemove = tempRoom.getPlayer(player.getId());
        if (playerToRemove != null) {
            tempRoom.getPlayers().remove(playerToRemove);
            System.out.println("✅ Player " + player.getName() + " (ID: " + player.getId() + ") left room " + roomid);
        } else {
            System.out.println("⚠️ Player " + player.getName() + " (ID: " + player.getId() + ") not found in room " + roomid);
        }
        return tempRoom.toRoomStatus("Player " + player.getName() + " has left the room.");
    }

    //Player use item
    public RoomStatusResponse PlayerUseItem(int roomid, String playeridActor, String playerIDtarget, int typeItem){

        Room tempRoom = getRoom(roomid);

        if(tempRoom == null){
            throw new IllegalArgumentException("Room not found");
        }

        Player tempPlayerActor = tempRoom.getPlayer(playeridActor);
        if (playerIDtarget == null) playerIDtarget = tempPlayerActor.getId();
        Player tempPlayerTarget = tempRoom.getPlayer(playerIDtarget);

        if(tempPlayerActor == null){
            throw new IllegalArgumentException("You are not in room");
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
        if(tempRoom.getIsSoloMode() && useItem.isTargetRequire()){
            if(!tempRoom.isSolo(playerIDtarget)) // check target is soloing
                throw new IllegalArgumentException("Target is not solo.");
        }

        UseItemRessult ressult = (UseItemRessult) useItem.use(new GameActionContext(tempRoom.getGun(), tempPlayerActor, tempPlayerTarget, tempRoom));
        if(ressult.getIsSuccess()) {
            tempPlayerActor.getItems().remove(useItem);
            System.out.println("Item " + useItem.getName() + " used by player " + tempPlayerActor.getName());
        } else {
            System.out.println("ERROR using item " + useItem.getName() + " by player " + tempPlayerActor.getName() + ": " + ressult.getMessage());
        }

        return tempRoom.toRoomStatus(ressult.getMessage());
    }

    //Player fire target
    public RoomStatusResponse PlayerFireTarget(int roomid, String playeridActor, String playeridTarget) {
        Room tempRoom = getRoom(roomid);
//        System.out.println(tempRoom.getID());
        if (tempRoom == null) {
            throw new IllegalArgumentException("Room not found");
        }

        System.out.println("Room infor origin:");
        tempRoom.Print();

        Player tempPlayerActor = tempRoom.getPlayer(playeridActor);
        Player tempPlayerTarget = tempRoom.getPlayer(playeridTarget);

//        System.out.println(tempPlayerActor.getID() + " " + tempPlayerTarget.getID());

        if (tempPlayerActor == null || tempPlayerTarget == null) {
            throw new IllegalArgumentException("Player not found in room");
        }

        //Check turn can action
        if(!checkCurrentTurn(roomid, playeridActor)){
            throw new IllegalArgumentException("It's not your turn to act.");
        }

        if(!tempPlayerActor.canAction()){
            throw new IllegalArgumentException("You have handcuffed or die, so u cannot perform actions this turn.");
        }

        //Check solomode
        if(tempRoom.getIsSoloMode()){
            if(!tempRoom.isSolo(playeridTarget))
                throw new IllegalArgumentException("Target is not solo.");
        }

        int dmg = tempRoom.getGun().fire();

        if(dmg > 0 && tempRoom.getIsSoloMode()){
            tempPlayerActor.setHealth(tempPlayerActor.getHealth() + 1);
            tempRoom.setIsSoloMode(false);
            for(Player p : tempRoom.getPlayers()){
                p.setIsSoloing(false);
            }
        } //If having damage, end solo mode

        System.out.println(dmg);
        tempPlayerTarget.setHealth(tempPlayerTarget.getHealth() - dmg);

        if(!Objects.equals(playeridActor, playeridTarget) || dmg != 0){
            tempRoom.endAction();
            System.out.println("END ACTION");
        }

        nextRound(tempRoom);

        System.out.println("Room infor after:");
        tempRoom.Print();
        return tempRoom.toRoomStatus("Player " + tempPlayerActor.getName() + " fired " + tempPlayerTarget.getName() + " for " + dmg + " damage.");
    }

    //End round when gun empty
    public void nextRound(Room room){

        // Kiểm tra xem gun còn đạn không
        int[] gunInfo = room.getGun().getInfoBullets();
        int totalBullets = gunInfo[0] + gunInfo[1]; // fakeCount + realCount

        if(totalBullets > 0){
            return;
        }

        room.getGun().reload(room.getPlayers().size());

        for(Player p : room.getPlayers()){
            p.CreateStarterItems();
        }
    }


    //Check turn belong someone
    public Boolean checkCurrentTurn(int roomid, String playerid){

        Room tempRoom = getRoom(roomid);
        Player tempPlayer = tempRoom.getPlayer(playerid);

        return tempRoom.getTurnOrder().peek() == tempPlayer;
    }

    public List<RoomLoby> getAnyRoom(int pageNumber) {
        int pageSize = 10;
        int startIndex = pageNumber * pageSize;  // Page 0 = index 0, page 1 = index 10
        int endIndex = Math.min(startIndex + pageSize, rooms.size());

        // Nếu không có room nào hoặc page out of range
        if (rooms.isEmpty() || startIndex >= rooms.size() || startIndex < 0) {
            System.out.println("No rooms available for page: " + pageNumber);
            return new java.util.ArrayList<>();  // Return empty list thay vì throw exception
        }

        // Log rooms
        List<RoomLoby> listroom = new ArrayList<RoomLoby>();
        System.out.println("Returning rooms for page " + pageNumber + " (index " + startIndex + " to " + endIndex + "):");
        for (int i = startIndex; i < endIndex; i++) {
            System.out.println("Room ID: " + rooms.get(i).getID() + " - Players: " + rooms.get(i).getPlayers().size());
            listroom.add(new RoomLoby(rooms.get(i).getID(), rooms.get(i).checkStatus()));
        }



        return listroom;
    }
}

