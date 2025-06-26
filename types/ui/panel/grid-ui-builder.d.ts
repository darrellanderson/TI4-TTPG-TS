import { AbstractUI } from "../abstract-ui/abtract-ui";
/**
 * Requires all entries be the same size.
 */
export declare class GridUIBuilder {
    private readonly _uis;
    private _maxRows;
    private _padding;
    private _spacing;
    addUIs(uis: Array<AbstractUI>): this;
    setMaxRows(maxRows: number): this;
    setPadding(padding: number): this;
    setSpacing(spacing: number): this;
    build(): AbstractUI;
}
