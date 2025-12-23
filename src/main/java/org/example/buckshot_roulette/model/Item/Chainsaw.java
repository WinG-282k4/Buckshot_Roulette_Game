package org.example.buckshot_roulette.model.Item;

import org.example.buckshot_roulette.dto.GameActionContext;

public class Chainsaw extends Item {

    public Chainsaw(int id, String name, boolean isTargetNulltable) {
        super(id, name, isTargetNulltable);
    }
    //Gap doi sat thuong cho lan ban tiep
    @Override
    public Object use(GameActionContext context) {
        context.getGun().setdoubledmg();
        return "You start the chainsaw. It roars to life, ready to cut through anything in its path.";
    }
}
