import { GameObject } from "@tabletop-playground/api";
import { AbstractRightClickCard } from "ttpg-darrell";
/**
 * Sol hero Jace X. 4th Air Legion
 *
 * ACTION: Remove each of your command tokens from the game board and return
 * them to your reinforcements.
 *
 * Then, purge this card.
 */
export declare class HeroHelioCommandArray extends AbstractRightClickCard {
    constructor();
    _helioCommandArray(object: GameObject, playerSlot: number): void;
}
