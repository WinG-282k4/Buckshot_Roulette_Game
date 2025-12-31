package org.example.buckshot_roulette.model.Item;

import org.example.buckshot_roulette.dto.GameActionContext;
import org.example.buckshot_roulette.dto.UseItemRessult;

public class Cigarette extends Item {

    public Cigarette (int id, String name, boolean isTargetNulltable) {
        super(id, name, isTargetNulltable);
    }

    //Vaajt phaamr nay giups hoi maus +1
    @Override
    public Object use(GameActionContext context) {
        context.getArtor().heal();
        return UseItemRessult.builder()
                .isSuccess(true)
                .message("You used a Cigarette. Your health has been increased by 1.")
                .build();
    }
}
