package model;

import model.Item.*;

public class ItemFactory {
    public static final int ItemTypeCount = 7;
    public static Item createItem(int ItemType) {
        return switch (ItemType) {
            case 1 -> new Beer(1, "Beer");
            case 2 -> new Bullet(2, "Bullet");
            case 3 -> new Chainsaw(3, "Chainsaw");
            case 4 -> new Cigarette(4, "Cigarette");
            case 5 -> new Glass(5, "Glass");
            case 6 -> new Handcuffs(6, "Handcuffs");
            case 7 -> new Viewfinder(7, "Viewfinder");
            default -> throw new IllegalArgumentException("Unknown item: " + ItemType);
        };
    }
}
