import { VerticalAlignment } from "@tabletop-playground/api";
import { AbstractUI } from "../abstract-ui/abtract-ui";
/**
 * Entries can be of varying sizes, aligned to top.
 */
export declare class HorizontalUIBuilder {
    private readonly _uis;
    private _padding;
    private _spacing;
    private _verticalAlignment;
    addUIs(uis: Array<AbstractUI>): HorizontalUIBuilder;
    setPadding(padding: number): HorizontalUIBuilder;
    setSpacing(spacing: number): HorizontalUIBuilder;
    setVerticalAlignment(verticalAlignment: VerticalAlignment): HorizontalUIBuilder;
    build(): AbstractUI;
}
