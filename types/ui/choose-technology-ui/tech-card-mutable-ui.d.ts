import { Card, ImageWidget } from "@tabletop-playground/api";
import { AbstractUI } from "../abstract-ui/abtract-ui";
import { CreateZoomedUiType } from "../zoomable-ui/zoomable-ui";
import { ZoomableUiFullyClickable } from "../zoomable-ui/zoomable-ui-fully-clickable";
export declare class UnzoomedTechCardMutableUI extends AbstractUI {
    constructor(scale: number, imageWidget: ImageWidget);
}
export declare class ZoomedTechCardUI extends AbstractUI {
    private readonly _imageWidget;
    constructor(scale: number, cardJson: string | undefined);
}
export declare class TechCardMutableUI extends ZoomableUiFullyClickable {
    private readonly _cardUitl;
    private readonly _imageWidget;
    private _cardJson;
    readonly _createZoomedUI: CreateZoomedUiType;
    constructor(scale: number);
    clearCard(): void;
    setCard(card: Card): void;
    /**
     * Spawn a new tech deck to get the card, use then destroy both.
     *
     * @param nsid
     * @returns
     */
    setCardNsid(techNsid: string): void;
}
