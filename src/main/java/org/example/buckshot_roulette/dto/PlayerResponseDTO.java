package org.example.buckshot_roulette.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.example.buckshot_roulette.model.Item.Item;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
public class PlayerResponseDTO {
    @JsonProperty("ID")
    private String ID;
    private String name;
    private String URLavatar;
    private int health;
    private List<Item> items;
    private List<String> effects;

    /**
     * Convert from Player model to PlayerResponseDTO
     * This handles the transformation of isHandcuffed and isSoloing to effects array
     */
    public static PlayerResponseDTO fromPlayer(org.example.buckshot_roulette.model.Player player) {
        List<String> effects = new ArrayList<>();

        // Add effects based on player status
        if (player.isHandcuffed()) {
            effects.add("handcuffed");
        }
        if (Boolean.TRUE.equals(player.getIsSoloing())) {
            effects.add("soloing");
        }

        return PlayerResponseDTO.builder()
                .ID(player.getId())
                .name(player.getName())
                .URLavatar(player.getURLavatar())
                .health(player.getHealth())
                .items(player.getItems())
                .effects(effects)
                .build();
    }
}

