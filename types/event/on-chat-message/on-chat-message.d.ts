import { IGlobal } from "ttpg-darrell";
/**
 * If a public chat message contains "@<player-name-prefix>",
 * chirp at that player.
 */
export declare class OnChatMessage implements IGlobal {
    private readonly _onChatMessage;
    init(): void;
}
