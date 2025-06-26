import { Container, GameObject, Player } from "@tabletop-playground/api";
import { IGlobal, SwapSplitCombine } from "ttpg-darrell";
export declare class RSwapSplitCombine extends SwapSplitCombine implements IGlobal {
    private readonly _find;
    constructor();
    getPlasticContainer(unit: "infantry" | "fighter", player: Player): Container | undefined;
    getPlastic(unit: "infantry" | "fighter", player: Player): GameObject | undefined;
    putPlastic(unit: "infantry" | "fighter", player: Player, obj: GameObject): boolean;
}
