package org.example.buckshot_roulette.model.Item;

import org.example.buckshot_roulette.dto.GameActionContext;

public class Cigarette extends Item {

    public Cigarette (int id, String name, boolean isTargetNulltable) {
        super(id, name, isTargetNulltable);
    }

    //Vaajt phaamr nay giups hoi maus +1
    @Override
    public Object use(GameActionContext context) {
        context.getArtor().heal();
        return "You light up the cigarette and take a deep drag.";
    }
}
