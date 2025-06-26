import { Card, GameObject } from "@tabletop-playground/api";
import { IGlobal, PlayerSlot } from "ttpg-darrell";
import { Faction } from "../../lib/faction-lib/faction/faction";
export declare const ACTION_UNPACK: string;
export declare const ACTION_REMOVE: string;
/**
 * Right click a faction reference card, "unpack" option.
 */
export declare class UnpackFactionContextMenuItem implements IGlobal {
    private readonly _onCustomActionHandler;
    init(): void;
    _maybeAddContextMenuItem(card: Card): void;
    _getFaction(obj: GameObject): Faction;
    _getClosest(obj: GameObject): PlayerSlot;
    _unpackFaction(obj: GameObject): void;
    _removeFaction(obj: GameObject): void;
}
