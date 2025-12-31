package org.example.buckshot_roulette.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
//Action messsage for wwebsocket
public class ActionResponse {
    private String actorId;
    private String action;
    private String targetid;
}
