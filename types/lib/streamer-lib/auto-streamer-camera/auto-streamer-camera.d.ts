import { Vector } from "@tabletop-playground/api";
import { IGlobal, NamespaceId, PlayerSlot } from "ttpg-darrell";
import { System } from "../../system-lib/system/system";
/**
 * Move the player's camera:
 *
 * - To system on system activation.
 * - To full map on turn change.
 * - To scoring area on all passed.
 *
 * No camera movement necessary for agenda, agenda UI is on screen.
 */
export declare class AutoStreamerCamera implements IGlobal {
    private readonly _streamerPlayerSlots;
    private readonly _scoreboard;
    private readonly _namespaceId;
    private readonly _onAllPlayersPassed;
    private readonly _onSystemActivated;
    private readonly _onTurnStateChanged;
    constructor(namespaceId: NamespaceId);
    init(): void;
    destroy(): void;
    addStreamerPlayerSlot(playerSlot: PlayerSlot): void;
    hasStreamerPlayerSlot(playerSlot: PlayerSlot): boolean;
    removeStreamerPlayerSlot(playerSlot: PlayerSlot): void;
    _load(): void;
    _save(): void;
    _lookAtSystem(system: System): void;
    _lookAtScoring(): void;
    _lookAtFullMap(): void;
    _lookAt(pos: Vector, height: number): void;
}
