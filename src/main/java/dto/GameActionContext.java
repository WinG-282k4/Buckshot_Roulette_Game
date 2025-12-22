package dto;

public class GameActionContext {
    IGunAction Gun;
    IPlayerAction artor;
    IPlayerAction target;
    IRoomAction room;

    public GameActionContext(IGunAction Gun, IPlayerAction artor, IPlayerAction target, IRoomAction room){
        this.Gun = Gun;
        this.artor = artor;
        this.target = target;
        this.room = room;
    }

    public IGunAction getGun() {
        return Gun;
    }

    public void setGun(IGunAction gun) {
        Gun = gun;
    }

    public IPlayerAction getArtor() {
        return artor;
    }

    public void setArtor(IPlayerAction artor) {
        this.artor = artor;
    }

    public IPlayerAction getTarget() {
        return target;
    }

    public void setTarget(IPlayerAction target) {
        this.target = target;
    }

    public IRoomAction getRoom() {
        return room;
    }

    public void setRoom(IRoomAction room) {
        this.room = room;
    }
}
