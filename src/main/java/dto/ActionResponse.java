package dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ActionResponse {
    private String actorId;
    private String action;
    private String targetid;
}
