import { HorizontalAlignment } from "@tabletop-playground/api";
import { AbstractUI } from "../abstract-ui/abtract-ui";
/**
 * Entries can be of varying sizes, aligned to left.
 */
export declare class VerticalUIBuilder {
    private readonly _uis;
    private _horizontalAligntment;
    private _padding;
    private _spacing;
    private _overrideHeight;
    addUIs(uis: Array<AbstractUI>): VerticalUIBuilder;
    setHorizontalAlignment(horizontalAlignment: HorizontalAlignment): VerticalUIBuilder;
    setOverrideHeight(overrideHeight: number): VerticalUIBuilder;
    setPadding(padding: number): VerticalUIBuilder;
    setSpacing(spacing: number): VerticalUIBuilder;
    build(): AbstractUI;
}
