package model;


import dto.IPlayerAction;
import lombok.Getter;
import lombok.Setter;
import model.Item.Item;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Getter
@Setter
public class Player implements IPlayerAction {

    private int ID;
    private String name;
    private int health;
    private boolean isHandcuffed;
    private List<Item> items;

    public Player(String name, int health) {
        this.name = name;
        this.health = health;
        this.isHandcuffed = false;
        this.items = new ArrayList<>();
    }

    @Override
    public void heal() {
        if(health < 6)
            this.health += 1; // healing logic
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public int getId() {
        return ID;
    }

    @Override
    public String toString() {
        return this.ID + ":" +this.name; // Trả về tên thay vì địa chỉ ô nhớ
    }




    @Override
    public void setHandcuffed(boolean handcuffed) {
        isHandcuffed = handcuffed;
    }

    // Additional methods related to Player behavior can be added here
    //Crater starter items
    public void CreateStarterItems(){
        //Add starter items to player
        for(int i = 0; i<4; i++){
        ThreadLocalRandom random = ThreadLocalRandom.current();
        int itemType = random.nextInt(1, ItemFactory.ItemTypeCount + 1);
        Item newItem = ItemFactory.createItem(itemType);
        this.items.add(newItem);
        }
    }

    //Lấy 1 item từ player theo id
    @Override
    public Item getItem(Class< ? extends Item> itemClass) {
        for (Item item : items) {
            if (itemClass.isInstance(item)) {
                return item;
            }
        }
        return null;
    }

    //Check Player can action
    public Boolean canAction(){
        Boolean result = this.health > 0 && !this.isHandcuffed;
        this.isHandcuffed = false;
        return result;
    }

}
