import { AbstractUI } from "../abstract-ui/abtract-ui";
export declare class TwoIconLabel extends AbstractUI {
    private readonly _icon1;
    private readonly _icon2;
    private readonly _label;
    constructor(scale: number);
    setIcon1(image: string, packageId: string): this;
    setIcon2(image: string, packageId: string): this;
    setLabel(text: string): this;
}
