package org.example.buckshot_roulette.model.Item;

import org.example.buckshot_roulette.dto.GameActionContext;

public class Beer extends  Item {

    public Beer(int id, String name, boolean isTargetNulltable) {
        super(id, name, isTargetNulltable);
    }
    //Bo qua vien ddan tiep theo
    @Override
    public Object use(GameActionContext context) {
        context.getGun().eject();
        return "You drink the beer and feel refreshed.";
    }
}
