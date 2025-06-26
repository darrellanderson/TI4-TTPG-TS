import { Button, ImageButton, Player, TextBox, WidgetSwitcher } from "@tabletop-playground/api";
import { TriggerableMulticastDelegate } from "ttpg-darrell";
import { AbstractUI } from "../abstract-ui/abtract-ui";
export declare class EditableButtonUI extends AbstractUI {
    onEdited: TriggerableMulticastDelegate<(text: string) => void>;
    readonly _onEditClicked: (_button: ImageButton, _player: Player) => void;
    readonly _onEditTextCommitted: () => void;
    private readonly _button;
    private readonly _editText;
    private readonly _widgetSwitcher;
    constructor(scale: number);
    destroy(): void;
    getButton(): Button;
    /**
     * Expost the TextBox in order to restrict value types (e.g. numbers only).
     * @returns
     */
    getTextBox(): TextBox;
    getWidgetSwitcher(): WidgetSwitcher;
}
