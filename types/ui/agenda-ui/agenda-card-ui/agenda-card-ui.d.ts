import { Card } from "@tabletop-playground/api";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { ZoomableUiFullyClickable } from "../../zoomable-ui/zoomable-ui-fully-clickable";
export declare class UnzoomedCardUI extends AbstractUI {
    constructor(agendaCard: Card, scale: number);
}
export declare class AgendaCardUI extends ZoomableUiFullyClickable {
    static _getCreateZoomedUI(agendaCard: Card, scale: number): () => AbstractUI;
    constructor(agendaCard: Card, scale: number);
}
export declare class AgendaCardFaceDownUI extends AbstractUI {
    constructor(scale: number);
}
