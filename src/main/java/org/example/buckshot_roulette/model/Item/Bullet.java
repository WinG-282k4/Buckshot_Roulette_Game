package model.Item;

import dto.GameActionContext;

public class Bullet extends  Item {

    public Bullet(int id, String name, boolean isTargetNulltable) {
        super(id, name, isTargetNulltable);
    }
    //Thêm 1 viên dan ngau nhien
    @Override
    public Object use(GameActionContext context) {
        context.getGun().Randomadd();
        return "You load the bullet into your gun.";
    }
}
