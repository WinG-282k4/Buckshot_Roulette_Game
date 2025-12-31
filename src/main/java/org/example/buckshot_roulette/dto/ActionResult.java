package org.example.buckshot_roulette.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ActionResult {
    private Boolean isSuccess;
    private String message;
    private Object data;
}
