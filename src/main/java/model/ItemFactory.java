package model;

import model.Item.*;

public class ItemFactory {
    public static final int ItemTypeCount = 7;
    public static Item createItem(int ItemType) {
        return switch (ItemType) {
            case 1 -> new Beer(1, "Beer", true);
            case 2 -> new Bullet(2, "Bullet", true);
            case 3 -> new Chainsaw(3, "Chainsaw",  true);
            case 4 -> new Cigarette(4, "Cigarette", true);
            case 5 -> new Glass(5, "Glass", true);
            case 6 -> new Handcuffs(6, "Handcuffs", true);
            case 7 -> new Viewfinder(7, "Viewfinder", false);
            default -> throw new IllegalArgumentException("Unknown item: " + ItemType);
        };
    }
}
