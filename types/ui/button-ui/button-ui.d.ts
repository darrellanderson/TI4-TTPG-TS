import { Button } from "@tabletop-playground/api";
import { AbstractUI } from "../abstract-ui/abtract-ui";
export declare class ButtonUI extends AbstractUI {
    private readonly _button;
    constructor(scale: number);
    destroy(): void;
    getButton(): Button;
}
