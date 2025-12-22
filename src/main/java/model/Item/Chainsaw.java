package model.Item;

import dto.GameActionContext;

public class Chainsaw extends Item {

    public Chainsaw(int typeItem, String name) {
        super(typeItem, name);
    }
    //Gap doi sat thuong cho lan ban tiep
    @Override
    public Object use(GameActionContext context) {
        context.getGun().setdoubledmg();
        return "You start the chainsaw. It roars to life, ready to cut through anything in its path.";
    }
}
