import { Button, Player } from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";
export declare class OnPlayerChangeColorRequest implements IGlobal {
    private _colorChangeWindow;
    readonly _onCancelClickedHandler: (_button: Button, _player: Player) => void;
    private readonly _onPlayerChangeColorRequestHandler;
    private readonly _onPlayerChangedColorHandler;
    _closeWindow(): void;
    init(): void;
    destroy(): void;
}
