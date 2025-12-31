package org.example.buckshot_roulette.model.Item;

import org.example.buckshot_roulette.dto.GameActionContext;
import org.example.buckshot_roulette.dto.UseItemRessult;

public class Beer extends  Item {

    public Beer(int id, String name, boolean isTargetNulltable) {
        super(id, name, isTargetNulltable);
    }
    //Bo qua vien ddan tiep theo
    @Override
    public Object use(GameActionContext context) {
        context.getGun().eject();
        return UseItemRessult.builder()
                .isSuccess(true)
                .message("You used a Beer. The next bullet has been ejected from the gun.")
                .build();
    }
}
