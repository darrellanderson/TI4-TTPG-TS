import { ContentButton, Player } from "@tabletop-playground/api";
import { AbstractUI } from "../abstract-ui/abtract-ui";
export type CreateZoomedUiType = (scale: number) => AbstractUI;
/**
 * Create a new UI containing the given UI and adding a zoom button.
 * Zooming calls the given function to create a new UI.
 *
 * Each player can only have one zoomed UI at a time, zomming a new UI will
 * close any existing one.
 */
export declare class ZoomableUI extends AbstractUI {
    private readonly _unzoomedUi;
    private readonly _zoomButton;
    static _getOnZoomClosedHandler(): (button: ContentButton, player: Player) => void;
    static _getOnZoomOpenHandler<T>(createZoomedUI: CreateZoomedUiType, scale: number): (button: T, player: Player) => void;
    constructor(unzoomedUi: AbstractUI, scale: number, createZoomedUI: CreateZoomedUiType);
    destroy(): void;
}
