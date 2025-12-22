package model.Item;

import dto.GameActionContext;

public class Handcuffs extends Item {

    public Handcuffs(int typeItem, String name) {
        super(typeItem, name);
    }

    //Su dung de cam tay ai do
    @Override
    public Object use(GameActionContext context) {
        context.getTarget().setHandcuffed(true);
        return "You secure the handcuffs around the target's wrists, restricting their movement.";
    }
}
