package org.example.buckshot_roulette.model.Item;

import org.example.buckshot_roulette.dto.GameActionContext;
import org.example.buckshot_roulette.dto.UseItemRessult;

public class Glass extends  Item {

    public Glass (int id, String name, boolean isTargetNulltable) {
        super(id, name, isTargetNulltable);
    }
    //Xem duowjc vien dan hien tai laf gia hay that
    @Override
    public Object use(GameActionContext context) {
        boolean bullet = context.getGun().peek();
        String result = bullet ? "The bullet is real" : "The Bullet is fake";
        System.out.println(bullet? "The bullet is real." : "The bullet is fake.");
        return UseItemRessult.builder()
                .isSuccess(true)
                .message(result)
                .build();
    }
}
