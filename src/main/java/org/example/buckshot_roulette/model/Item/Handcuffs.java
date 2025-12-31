package org.example.buckshot_roulette.model.Item;

import org.example.buckshot_roulette.dto.GameActionContext;
import org.example.buckshot_roulette.dto.ActionResult;

import java.util.Objects;

public class Handcuffs extends Item {

    public Handcuffs(int id, String name, boolean isTargetNulltable) {
        super(id, name, isTargetNulltable);
    }

    //Su dung de cam tay ai do
    @Override
    public Object use(GameActionContext context) {
        if (Objects.equals(context.getArtor().getId(), context.getTarget().getId())) {
            return ActionResult.builder()
                    .isSuccess(false)
                    .message("You cannot handcuff yourself.")
                    .build();
        }
        context.getTarget().setHandcuffed(true);
        return ActionResult.builder()
                .isSuccess(true)
                .message("You used Handcuffs on " + context.getTarget().getName() + ". They are now handcuffed.")
                .build();
    }
}
