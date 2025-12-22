package model.Item;

import dto.GameActionContext;

public class Cigarette extends Item {

    public Cigarette(int typeItem, String name) {
        super(typeItem, name);
    }

    //Vaajt phaamr nay giups hoi maus +1
    @Override
    public Object use(GameActionContext context) {
        context.getArtor().heal();
        return "You light up the cigarette and take a deep drag.";
    }
}
