import { Player, Sound } from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";
export declare class OnWhisper implements IGlobal {
    static readonly __sound: Sound;
    static chirpAtPlayer(player: Player): void;
    private readonly _onWhisper;
    init(): void;
}
