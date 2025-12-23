package org.example.buckshot_roulette.dto;


import org.example.buckshot_roulette.model.Item.Item;

public interface IPlayerAction {
    void heal();
    void setHandcuffed(boolean status);
    String getName();
    String getId();
    Item getItem(Class< ? extends Item> itemClass);
}
