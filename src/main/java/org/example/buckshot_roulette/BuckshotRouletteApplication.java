package org.example.buckshot_roulette;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class BuckshotRouletteApplication {

    public static void main(String[] args) {
        SpringApplication.run(BuckshotRouletteApplication.class, args);
    }

}
