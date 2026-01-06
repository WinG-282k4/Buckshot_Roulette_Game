package org.example.buckshot_roulette.model.Item;

import org.example.buckshot_roulette.dto.GameActionContext;
import org.example.buckshot_roulette.dto.ActionResult;

public class Bullet extends  Item {

    public Bullet(int id, String name, boolean isTargetNulltable) {
        super(id, name, isTargetNulltable);
    }
    //Thêm 1 viên dan ngau nhien
    @Override
    public Object use(GameActionContext context) {
        context.getGun().Randomadd();
        return ActionResult.builder()
                .isSuccess(true)
                .message(context.getArtor().getName() + " used Bullet")
                .build();
    }
}
