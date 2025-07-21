import { Vector } from "@tabletop-playground/api";
import { Planet } from "../planet/planet";
export declare class PlanetAttachmentLayout {
    static _getOffset(index: number): Vector;
    layout(planet: Planet): void;
}
