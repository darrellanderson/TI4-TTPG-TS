import { IGlobal, NamespaceId, TriggerableMulticastDelegate } from "ttpg-darrell";
import { GameData } from "../../game-data-lib/game-data/game-data";
export declare class UseStreamerBuddy implements IGlobal {
    readonly onStreamerBuddyChanged: TriggerableMulticastDelegate<(isActive: boolean) => void>;
    private readonly _namespaceId;
    private _useStreeamerBuddy;
    readonly _onGameData: (gameData: GameData) => void;
    constructor(namespaceId: NamespaceId);
    init(): void;
    getUseStreamerBuddy(): boolean;
    setUseStreamerBuddy(useStreamerBuddy: boolean): void;
    private _load;
    private _save;
}
