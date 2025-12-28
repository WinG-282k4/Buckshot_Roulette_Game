package org.example.buckshot_roulette.model;

import org.example.buckshot_roulette.dto.IGunAction;
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
    private int fakeCount;
    private int realCount;

    public Gun(Deque<Boolean> bullets, Boolean isDoubledmg) {
        this.bullets = bullets;
        this.isDoubledmg = isDoubledmg;
    }

    public Gun(){
        this.bullets = new ArrayDeque<>();
        this.isDoubledmg = false;
        fakeCount = 0;
        realCount = 0;
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
        Boolean bullet = this.bullets.poll();
        if (bullet == null) {
            return 0; // No bullets left
        }

        int dmg = bullet ? 1 : 0;

        // Update counts
        if (bullet) {
            realCount--;
        } else {
            fakeCount--;
        }

        if(isDoubledmg){
            dmg *= 2;
        }
        this.isDoubledmg = false;

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
        Boolean bullet = this.bullets.pollFirst();
        if (bullet != null) {
            // Update counts
            if (bullet) {
                realCount--;
            } else {
                fakeCount--;
            }
        }
    }

    //Add random bullet at the end
    @Override
    public void Randomadd() {
        double rand = Math.random();
        if (rand < 0.5) {
            this.bullets.addLast(true);
            realCount++;
        } else {
            this.bullets.addLast(false);
            fakeCount++;
        }
    }

    //Load bullet with random count
    public int[] loadBullet(int count) {
        this.realCount = 0;
        this.fakeCount = 0;
        for (int i = 0; i < count; i++) {
            double rand = Math.random();
            if (rand < 0.5) {
                this.bullets.addFirst(true);
                realCount ++;
            } else {
                this.bullets.addFirst(false);
                fakeCount ++;
            }
        }

        return new int[]{fakeCount, realCount};
    }

    public int[] reload(int Playercount) {
        int randomNumber = ThreadLocalRandom.current().nextInt(Playercount * 2, Playercount * 4 + 1);
        this.isDoubledmg = false;
        return loadBullet(randomNumber);
    }

    //Get info bullets
    public int[] getInfoBullets() {
        return new int[]{this.fakeCount, this.realCount};
    }
}
