import { IGlobal } from "ttpg-darrell";
export declare class StartGame implements IGlobal {
    private readonly _onStartGameRequest;
    init(): void;
    _applyPlayerCount(): void;
    _doRemove(): void;
    _maybeFlipScoreboard(): void;
}
