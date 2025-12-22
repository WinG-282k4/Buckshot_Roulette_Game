package model.Item;

import dto.GameActionContext;

public class Glass extends  Item {

    public Glass(int typeItem, String name) {
        super(typeItem, name);
    }
    //Xem duowjc vien dan hien tai laf gia hay that
    @Override
    public Object use(GameActionContext context) {
        boolean bullet = context.getGun().peek();
        System.out.println(bullet? "The bullet is real." : "The bullet is fake.");
        return bullet;
    }
}
