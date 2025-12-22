package model.Item;

import dto.GameActionContext;

public class Beer extends  Item {

    public Beer(int typeItem, String name) {
        super(typeItem, name);
    }
    //Bo qua vien ddan tiep theo
    @Override
    public Object use(GameActionContext context) {
        context.getGun().eject();
        return "You drink the beer and feel refreshed.";
    }
}
