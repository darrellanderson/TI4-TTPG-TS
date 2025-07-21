import { AbstractUI } from "../abstract-ui/abtract-ui";
import { CreateZoomedUiType } from "./zoomable-ui";
/**
 * Make the unzoomed UI clickable, show the zoomed version when clicked.
 */
export declare class ZoomableUiFullyClickable extends AbstractUI {
    private readonly _unzoomedUi;
    constructor(unzoomedUi: AbstractUI, scale: number, createZoomedUI: CreateZoomedUiType);
    destroy(): void;
}
