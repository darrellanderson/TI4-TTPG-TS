import { Widget } from "@tabletop-playground/api";
export type UI_SIZE = {
    w: number;
    h: number;
};
/**
 * Represent a single UI widget.
 *
 * Needing everything at constructor time is a bit of a pain, but it's the best
 * way to ensure that the UI is immutable.
 */
export declare class AbstractUI {
    private readonly _widget;
    private readonly _width;
    private readonly _height;
    constructor(widget: Widget, size: UI_SIZE);
    /**
     * Remove any event handlers, etc.
     */
    destroy(): void;
    getSize(): UI_SIZE;
    getWidget(): Widget;
}
