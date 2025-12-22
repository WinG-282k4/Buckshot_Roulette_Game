package model;

import dto.IGunAction;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.concurrent.ThreadLocalRandom;

@Getter
@Setter
public class Gun implements IGunAction {
    private Deque<Boolean> bullets;
    private Boolean isDoubledmg;

    public Gun(Deque<Boolean> bullets, Boolean isDoubledmg) {
        this.bullets = bullets;
        this.isDoubledmg = isDoubledmg;
    }

    public Gun(){
        this.bullets = new ArrayDeque<>();
        this.isDoubledmg = false;
    }

    public Boolean getDoubledmg() {
        return isDoubledmg;
    }

    public void setDoubledmg(Boolean doubledmg) {
        isDoubledmg = doubledmg;
    }

    // Additional methods related to Gun behavior can be added here
    //Get dmg
    public int fire(){
        int dmg = this.bullets.poll()? 1 : 0;
        if(isDoubledmg){
            dmg *= 2;
        }
        this.isDoubledmg = false;
//        this.bullets.poll();
        return dmg;
    }

    @Override
    public Boolean peek(){
        return bullets.peek();
    }

    @Override
    public void setdoubledmg() {
        this.isDoubledmg = true;
    }

    //Remove first bullet
    @Override
    public void eject() {
        this.bullets.pollFirst();
    }

    //Add random bullet at the end
    @Override
    public void Randomadd() {
        double rand = Math.random();
        if (rand < 0.5) {
            this.bullets.addLast(true);
        } else {
            this.bullets.addLast(false);
        }
    }

    //Load bullet with random count
    public int[] loadBullet(int count) {
        int RealCount = 0;
        int FakeCount = 0;
        for (int i = 0; i < count; i++) {
            double rand = Math.random();
            if (rand < 0.5) {
                this.bullets.addFirst(true);
                RealCount ++;
            } else {
                this.bullets.addFirst(false);
                FakeCount ++;
            }
        }

        return new int[]{FakeCount, RealCount};
    }

    public int[] reload(int Playercount) {
        int randomNumber = ThreadLocalRandom.current().nextInt(Playercount * 2, Playercount * 4 + 1);
        this.isDoubledmg = false;
        return loadBullet(randomNumber);
    }


}
