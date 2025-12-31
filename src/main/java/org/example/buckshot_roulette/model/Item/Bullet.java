package org.example.buckshot_roulette.model.Item;

import org.example.buckshot_roulette.dto.GameActionContext;
import org.example.buckshot_roulette.dto.UseItemRessult;

public class Bullet extends  Item {

    public Bullet(int id, String name, boolean isTargetNulltable) {
        super(id, name, isTargetNulltable);
    }
    //Thêm 1 viên dan ngau nhien
    @Override
    public Object use(GameActionContext context) {
        context.getGun().Randomadd();
        return UseItemRessult.builder()
                .isSuccess(true)
                .message("You used a Bullet. A random bullet has been added to the gun.")
                .build();
    }
}
