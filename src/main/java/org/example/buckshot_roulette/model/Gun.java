package org.example.buckshot_roulette.model;

import lombok.Getter;
import lombok.Setter;
import org.example.buckshot_roulette.dto.IGunAction;

import java.util.*;
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

        List<Boolean> bag = new ArrayList<>();

        // BƯỚC 1: Xác định số lượng đạn thật (Real) mục tiêu
        int targetReal;

        if (count <= 2) {
            // Nếu chỉ có 2 viên, bắt buộc 1 Thật - 1 Giả
            targetReal = 1;
        } else {
            // Logic: Số đạn thật sẽ nằm trong khoảng [Total/2 - 1] đến [Total/2 + 1]
            // Ví dụ: 8 viên -> Real chỉ có thể là 3, 4, hoặc 5. (Không bao giờ là 1, 2, 6, 7)
            int minReal = Math.max(1, (count / 2) - 1);
            int maxReal = Math.min(count - 1, (count / 2) + 1);

            // Cần xử lý trường hợp số lẻ (ví dụ 5 viên: 5/2 = 2. Random từ 1 đến 3)
            if (count % 2 != 0) {
                maxReal = Math.min(count - 1, (count / 2) + 2);
            }

            targetReal = ThreadLocalRandom.current().nextInt(minReal, maxReal + 1);
        }

        // BƯỚC 2: Tính số đạn giả
        int targetFake = count - targetReal;

        // BƯỚC 3: Đưa vào túi (Bag)
        for (int i = 0; i < targetReal; i++) {
            bag.add(true);
        }
        for (int i = 0; i < targetFake; i++) {
            bag.add(false);
        }

        // BƯỚC 4: Xáo trộn (Shuffle)
        Collections.shuffle(bag);

        // BƯỚC 5: Nạp vào băng đạn game
        for (Boolean isReal : bag) {
            this.bullets.addFirst(isReal);
        }

        // Lưu lại property để hiển thị
        this.realCount = targetReal;
        this.fakeCount = targetFake;

        return new int[]{fakeCount, realCount};
    }

    public int[] reload(int Playercount) {
        int randomNumber = ThreadLocalRandom.current().nextInt(Playercount * 2, Playercount * 4 + 1);
        this.bullets.clear();
        this.isDoubledmg = false;
        return loadBullet(randomNumber);
    }

    //Get info bullets
    public int[] getInfoBullets() {
        return new int[]{this.fakeCount, this.realCount};
    }

    //Reset gun
    public void resetGun(){
        this.bullets.clear();
        this.isDoubledmg = false;
        this.fakeCount = 0;
        this.realCount = 0;
    }
}
