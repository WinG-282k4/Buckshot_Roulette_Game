package org.example.buckshot_roulette.service;

import org.example.buckshot_roulette.dto.*;
import org.example.buckshot_roulette.model.Item.Item;
import org.example.buckshot_roulette.model.ItemFactory;
import org.example.buckshot_roulette.model.Player;
import org.example.buckshot_roulette.model.Room;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.ThreadLocalRandom;

@org.springframework.stereotype.Service
public class Service {

    public static List<Room> rooms;

    @Autowired
    private playerService playerservice;

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

    //Get room by player ID
    public Room getRoomByPlayerId(String playerId) {
        for(Room r : rooms){
            if(r.isExistPlayer(playerId)){
                return r;
            }
        }
        return null;
    }

    //Start Game
    public ActionResult StartGame(int roomid, String playerid){
        Room tempRoom = getRoom(roomid);

        if (!tempRoom.getOwnerid().equals(playerid)) {
            return ActionResult.builder()
                    .isSuccess(false)
                    .message("Only the room owner can start the game")
                    .data(null)
                    .build();
        }

        if(tempRoom == null){
            throw new IllegalArgumentException("Room not found");
        }

        tempRoom.setTurnOrder();
        tempRoom.setIsSoloMode(false);

        int PlayerCount = tempRoom.getPlayers().size();
        tempRoom.getGun().reload(PlayerCount);

        for(Player p : tempRoom.getPlayers()){
            p.getItems().clear();
            p.CreateStarterItems();
            p.setHealth(5);
        }

        System.out.println("Room infor at start game:");
        tempRoom.Print();

        return ActionResult.builder()
                .isSuccess(true)
                .message("Game started successfully")
                .data(roomid)
                .build();
    }

    //Create new Room
    public int CreaterRoom(String ownerid){
        int random = ThreadLocalRandom.current().nextInt(0,999);
        int NewRoomID = rooms.size()*1000 + random; //RandomID
        Room room = new Room(NewRoomID, ownerid);
        rooms.add(room);
        return room.getID();
    }

    //Player join Room
    public ActionResult AddPlayerToRoom(int roomid, Player player) {
        Room tempRoom = getRoom(roomid);

        if (tempRoom == null) {
            throw new IllegalArgumentException("Room not found");
        }

        //Check player valid
        Player validPlayer = playerservice.getPlayerById(player.getId());
        if (validPlayer == null) {
            return ActionResult.builder()
                    .isSuccess(false)
                    .message("Player not found in server")
                    .data(null)
                    .build();
        }

        //Chekc player already in another room
        if(validPlayer.getIsInRoom()){
            return ActionResult.builder()
                    .isSuccess(false)
                    .message("Cannot join this room since player is already in another room")
                    .data(null)
                    .build();
        }

        // Check if player with same ID already in room (important for reload scenario)
        if (tempRoom.isExistPlayer(player.getId())) {

            System.out.println("Player " + player.getName() + " (ID: " + player.getId() + ") already in room, updating reference");

            return ActionResult.builder()
                    .isSuccess(false)
                    .message("Player joined the room before")
                    .build();
        }

        // Check if room is full
        if (tempRoom.getPlayers().size() >= 4) {
            throw new IllegalArgumentException("Room is full (max 4 players)");
        }

        // Check if game already started (turnOrder has been set)
        if (tempRoom.getTurnOrder().peek() != null) {
            throw new IllegalArgumentException("Game has already started, cannot join");
        }

        System.out.println("Player " + validPlayer.getName() + " (ID: " + validPlayer.getId() + ") joining room");
        System.out.println("Player " + validPlayer.getName() + " have avatar: " + validPlayer.getURLavatar());

        tempRoom.getPlayers().add(validPlayer);
        validPlayer.setIsInRoom(true);
        System.out.println("Player " + validPlayer.getName() + " (ID: " + validPlayer.getId() + ") joined room " + roomid);
        return ActionResult.builder()
                .isSuccess(true)
                .message("Player joined the room successfully")
                .data(validPlayer)
                .build();
    }

    //Player leave Room
    public ActionResult RemovePlayerFromRoom(int roomid, Player player){
        Room tempRoom = getRoom(roomid);

        if(tempRoom == null){
            throw new IllegalArgumentException("Room not found");
        }

        if (tempRoom.checkStatus().equals("Playing")) {
            return ActionResult.builder()
                    .isSuccess(false)
                    .message("Cannot leave room while game is in progress")
                    .data(null)
                    .build();
        }

        // Remove player by ID instead of object reference
        Player playerToRemove = tempRoom.getPlayer(player.getId());
        if (playerToRemove != null) {
            tempRoom.getPlayers().remove(playerToRemove);
            playerToRemove.setIsInRoom(false);
            System.out.println("Player " + player.getName() + " (ID: " + player.getId() + ") left room " + roomid);
        } else {
            System.out.println("Player " + player.getName() + " (ID: " + player.getId() + ") not found in room " + roomid);
        }

        //If room empty, remove room
        checkRoomEmpty(roomid);

        return ActionResult.builder()
                .isSuccess(true)
                .message("Player" + player.getName() + "left the room")
                .data(null)
                .build();
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

        //Use item after checked
        ActionResult ressult = (ActionResult) useItem.use(new GameActionContext(tempRoom.getGun(), tempPlayerActor, tempPlayerTarget, tempRoom));
        if(ressult.getIsSuccess()) {
            tempPlayerActor.getItems().remove(useItem);
            System.out.println("Item " + useItem.getName() + " used by player " + tempPlayerActor.getName());
        } else {
            System.out.println("ERROR using item " + useItem.getName() + " by player " + tempPlayerActor.getName() + ": " + ressult.getMessage());
        }

        //Build item response
        RoomStatusResponse roomresponse =  tempRoom.toRoomStatus(ressult.getMessage());

        //Buil action response
        roomresponse.setActionResponse(ActionResponse.builder()
                .actorId(playeridActor)
//                .actoravatar(tempPlayerActor.getURLavatar())
                .action("USE_ITEM_" + useItem.getTypeItem())
                .targetid(playerIDtarget)
//                .targetavatar(tempPlayerTarget.getURLavatar())
                .build());
        return roomresponse;
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

        //Build response message
        RoomStatusResponse roomResponse = tempRoom.toRoomStatus("Player " + tempPlayerActor.getName() + " fired " + tempPlayerTarget.getName() + " for " + dmg + " damage.");

        //Build action response
        roomResponse.setActionResponse(ActionResponse.builder()
                .actorId(playeridActor)
//                .actoravatar(tempPlayerActor.getURLavatar())
                .action(dmg == 0 ? "FIRE_FAKE" : "FIRE_REAL")
                .targetid(playeridTarget)
//                .targetavatar(tempPlayerTarget.getURLavatar())
                .build());

        return  roomResponse;
    }

    //End round when gun empty
    public void nextRound(Room room){

        // Check gun has bullets, if yes, do nothing
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

        Boolean result = false;

        //Check tunroder om solo mode or not
        if (tempRoom.getIsSoloMode()) {

            //Check solo turn order to get currrent turn
            assert tempRoom.getSoloTurnOrder().peek() != null;
            if(tempRoom.getSoloTurnOrder().peek().getId().equals(playerid)){
                result = true;
            }
        }else {

            //if not, check normal turn order
            assert tempRoom.getTurnOrder().peek() != null;
            if (tempRoom.getTurnOrder().peek().getId().equals(playerid)) {
                result = true;
            }
        }
        return result;
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

    //Check room have player, if not, remove room
    public void checkRoomEmpty(int roomid){
        Room room = getRoom(roomid);

        if (room.getPlayers().isEmpty()){
            rooms.remove(room);
            System.out.println("Room " + roomid + " is empty and has been removed.");
        }
    }

    //
}

