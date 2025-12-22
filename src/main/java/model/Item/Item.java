package model.Item;

import dto.GameActionContext;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public abstract class Item {
    private int typeItem;
    private String name;

    public Item(int typeItem, String name) {
        this.typeItem = typeItem;
        this.name = name;
    }

    @Override
    public String toString() {
        return this.name;
    }

    public Object use(GameActionContext context){
        return null;
    }

    public int getTypeItem() {
        return typeItem;
    }

    public void setTypeItem(int typeItem) {
        this.typeItem = typeItem;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

}
