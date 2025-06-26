import { AbstractUI } from "../../ui/abstract-ui/abtract-ui";
export declare class SwitcherUI extends AbstractUI {
    private readonly _switcher;
    constructor(uis: Array<AbstractUI>);
    switchToIndex(index: number): void;
}
