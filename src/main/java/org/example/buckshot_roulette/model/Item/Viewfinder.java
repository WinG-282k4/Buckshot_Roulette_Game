package org.example.buckshot_roulette.model.Item;

import org.example.buckshot_roulette.dto.GameActionContext;

public class Viewfinder extends Item{

    public Viewfinder(int id, String name, boolean isTargetNulltable) {
        super(id, name, isTargetNulltable);
    }

    //Chonj 1 nguoi ddeer solo
    // chi huu dung trong 4 nguoi choi
    @Override
    public Object use(GameActionContext context) {
        context.getRoom().setSoloMode(true, context.getArtor().getId(), context.getTarget().getId());
        System.out.println("<UNK> <UNK> <UNK> <UNK> <UNK> <UNK> <UNK> <UNK> <UNK>");
        System.out.println("You have activated solo mode between " + context.getArtor().getName() + " and " + context.getTarget().getName() + ".");
        return "Activated solo mode between " + context.getArtor().getName() + " and " + context.getTarget().getName() + ".";
    }
}
