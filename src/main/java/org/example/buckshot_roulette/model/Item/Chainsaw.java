package org.example.buckshot_roulette.model.Item;

import org.example.buckshot_roulette.dto.GameActionContext;
import org.example.buckshot_roulette.dto.UseItemRessult;

public class Chainsaw extends Item {

    public Chainsaw(int id, String name, boolean isTargetNulltable) {
        super(id, name, isTargetNulltable);
    }
    //Gap doi sat thuong cho lan ban tiep
    @Override
    public Object use(GameActionContext context) {
        context.getGun().setdoubledmg();
        return UseItemRessult.builder()
                .isSuccess(true)
                .message("You used a Chainsaw. Your next shot will deal double damage.")
                .build();
    }
}
