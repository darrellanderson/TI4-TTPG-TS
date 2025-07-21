import { Player } from "@tabletop-playground/api";
import { IGlobal, NamespaceId } from "ttpg-darrell";
/**
 * Report whisper CONTENTS to the streamer.
 */
export declare class WhisperSpy implements IGlobal {
    private readonly _namespaceId;
    private readonly _reportToPlayerNames;
    private readonly _onWhisper;
    constructor(namespaceId: NamespaceId);
    init(): void;
    /**
     * To prevent abuse, only report to unseated players.
     *
     * @param player
     */
    isLegalReportTo(player: Player): boolean;
    hasReportTo(player: Player): boolean;
    addReportTo(player: Player): void;
    removeReportTo(player: Player): void;
    private _save;
    private _load;
}
