package org.example.buckshot_roulette.model.Item;

import org.example.buckshot_roulette.dto.GameActionContext;
import org.example.buckshot_roulette.dto.ActionResult;

public class Cigarette extends Item {

    public Cigarette (int id, String name, boolean isTargetNulltable) {
        super(id, name, isTargetNulltable);
    }

    //Vaajt phaamr nay giups hoi maus +1
    @Override
    public Object use(GameActionContext context) {
        context.getArtor().heal();
        return ActionResult.builder()
                .isSuccess(true)
                .message(context.getArtor().getName() + " used a Cigarette. " + context.getArtor().getName() + " health has been increased by 1.")
                .build();
    }
}
