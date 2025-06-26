import { Card } from "@tabletop-playground/api";
import { Planet } from "../planet/planet";
import { PlanetAttachment } from "./planet-attachment";
/**
 * Add attachment icons to planet cards.
 */
export declare class PlanetCardLayout {
    layout(planet: Planet): void;
    _getCard(planet: Planet): Card | undefined;
    _removeUIs(card: Card): void;
    _addImageCardFace(card: Card, attachment: PlanetAttachment, index: number): void;
    _addImageCardBack(card: Card, attachment: PlanetAttachment, index: number): void;
}
