package org.example.buckshot_roulette.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UseItemRessult {
    private Boolean isSuccess;
    private String message;
}
