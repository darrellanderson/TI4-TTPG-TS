import { Slider } from "@tabletop-playground/api";
import { AbstractUI } from "../abstract-ui/abtract-ui";
export declare class SliderWithValueUI extends AbstractUI {
    private readonly _slider;
    constructor(scale: number);
    getSlider(): Slider;
}
