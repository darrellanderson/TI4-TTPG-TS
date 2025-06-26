import { Card } from "@tabletop-playground/api";
import { CreateZoomedUiType } from "./zoomable-ui";
import { AbstractUI } from "../abstract-ui/abtract-ui";
export declare class ZoomedCardUI extends AbstractUI {
    constructor(card: Card, scale: number);
}
/**
 * UI generator for a card.
 */
export declare class CreateZoomedCardUI {
    private readonly _card;
    constructor(card: Card);
    get(): CreateZoomedUiType;
}
