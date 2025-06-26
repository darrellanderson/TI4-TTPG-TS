import { Button } from "@tabletop-playground/api";
import { AbstractUI } from "../abstract-ui/abtract-ui";
export declare class LongButtonUI extends AbstractUI {
    private readonly _button;
    constructor(scaledWidth: number, scale: number);
    destroy(): void;
    getButton(): Button;
}
