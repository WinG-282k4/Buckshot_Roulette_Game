package org.example.buckshot_roulette.dto;

public interface IGunAction {
    Boolean peek(); //Xem viên đạn tiếp theo
    void setdoubledmg();
    void eject(); //loại bỏ viên đạn tiếp theo
    void Randomadd(); //thêm 1 viên đạn ngẫu nhiêu vào cuối

}
