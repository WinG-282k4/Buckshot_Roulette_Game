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

    private Long ID;
    private String name;
    private int health;
    private boolean isHandcuffed;
    private List<Item> items;
    private Boolean isSoloing;

    public Player(String name) {
        this.ID = createID();
        this.name = name;
        this.health = 5;
        this.isHandcuffed = false;
        this.items = new ArrayList<>();
        this.isSoloing = false;
    }

    private Long createID() {
        // Sử dụng System.currentTimeMillis() thay vì tạo object Date mới để tiết kiệm tài nguyên
        long timestamp = System.currentTimeMillis();
        int random = ThreadLocalRandom.current().nextInt(0, 9999);

        // Kết hợp thay vì cộng dồn để tránh trùng
        return timestamp * 10000 + random;
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
    public Long getId() {
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
