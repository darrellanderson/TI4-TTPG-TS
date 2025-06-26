import { UIElement, Widget } from "@tabletop-playground/api";
export declare class UiTitle {
    private readonly _text1;
    private readonly _text2;
    private readonly _text3;
    private readonly _border;
    _createTitleUI(): UIElement;
    _createTitleWidget(scale: number): Widget;
    tint(alpha: number): void;
}
