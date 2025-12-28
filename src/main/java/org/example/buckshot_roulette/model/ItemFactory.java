package org.example.buckshot_roulette.model;

import org.example.buckshot_roulette.model.Item.*;

public class ItemFactory {
    public static final int ItemTypeCount = 7;
    public static Item createItem(int ItemType) {
        return switch (ItemType) {
            case 1 -> new Beer(1, "Beer", false);
            case 2 -> new Bullet(2, "Bullet", false);
            case 3 -> new Chainsaw(3, "Chainsaw",  false);
            case 4 -> new Cigarette(4, "Cigarette", false);
            case 5 -> new Glass(5, "Glass", false);
            case 6 -> new Handcuffs(6, "Handcuffs", true);
            case 7 -> new Viewfinder(7, "Viewfinder", true);
            default -> throw new IllegalArgumentException("Unknown item: " + ItemType);
        };
    }
}
