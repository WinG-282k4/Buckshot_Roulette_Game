package dto;


import model.Item.Item;

public interface IPlayerAction {
    void heal();
    void setHandcuffed(boolean status);
    String getName();
    Long getId();
    Item getItem(Class< ? extends Item> itemClass);
}
