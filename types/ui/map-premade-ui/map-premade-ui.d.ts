import { Player, TextBox } from "@tabletop-playground/api";
import { TriggerableMulticastDelegate } from "ttpg-darrell";
import { PremadeMapType } from "../../lib/map-string-lib/data/premade-map-type";
import { AbstractUI } from "../abstract-ui/abtract-ui";
export declare class MapPremadeUI extends AbstractUI {
    readonly onMapString: TriggerableMulticastDelegate<(mapString: string) => void>;
    private _mapString;
    private readonly _premadeMapButtons;
    readonly _onFilterTextChanged: (_textBox: TextBox, _player: Player, text: string) => void;
    static _emptyMapString(playerCount: number): string;
    static getPremadeMaps(playerCount: number): Array<PremadeMapType>;
    constructor(scale: number);
}
