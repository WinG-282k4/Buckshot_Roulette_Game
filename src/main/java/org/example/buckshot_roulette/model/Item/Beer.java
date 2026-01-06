package org.example.buckshot_roulette.model.Item;

import org.example.buckshot_roulette.dto.GameActionContext;
import org.example.buckshot_roulette.dto.ActionResult;

public class Beer extends  Item {

    public Beer(int id, String name, boolean isTargetNulltable) {
        super(id, name, isTargetNulltable);
    }
    //Bo qua vien ddan tiep theo
    @Override
    public Object use(GameActionContext context) {
        context.getGun().eject();
        return ActionResult.builder()
                .isSuccess(true)
                .message(context.getArtor().getName() + " used Beer")
                .build();
    }
}
