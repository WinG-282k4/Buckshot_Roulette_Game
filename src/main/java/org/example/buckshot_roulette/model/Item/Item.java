package org.example.buckshot_roulette.model.Item;

import org.example.buckshot_roulette.dto.GameActionContext;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public abstract class Item {
    private int typeItem;
    private String name;
    @JsonProperty("isTargetNulltable")
    private boolean isTargetRequire;

    public Item( int typeItem, String name, boolean isTargetRequire) {
        this.typeItem = typeItem;
        this.name = name;
        this.isTargetRequire = isTargetRequire;
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
