import { Hex, Timer, TurnOrder } from "ttpg-darrell";
import { AllBorders } from "../lib/border-lib/all-borders/all-borders";
import { AutoStreamerCamera } from "../lib/streamer-lib/auto-streamer-camera/auto-streamer-camera";
import { Config } from "../lib/config/config";
import { FactionRegistry } from "../lib/faction-lib/registry/faction-registry";
import { GameDataUpdator } from "../lib/game-data-lib/game-data-updator/game-data-updator";
import { GlobalEvents } from "./global-events";
import { GoalReporter } from "../lib/game-data-lib/objective-progress/goal-reporter";
import { HideMouseCursor } from "../lib/streamer-lib/hide-mouse-cursor/hide-mouse-cursor";
import { HomebrewRegistry } from "../lib/homebrew-lib/homebrew-registry/homebrew-registry";
import { LastGameData } from "../lib/game-data-lib/last-game-data/last-game-data";
import { PlanetAttachmentRegistry } from "../lib/system-lib/registry/planet-attachment-registry";
import { PlayerActionPhaseTime } from "../lib/player-lib/player-action-phase-time/player-action-phase-time";
import { PlayerColor } from "../lib/player-lib/player-color/player-color";
import { PlayerName } from "../lib/player-lib/player-name/player-name";
import { PlayerSeats } from "../lib/player-lib/player-seats/player-seats";
import { RemoveRegistry } from "../lib/remove-lib/registry/remove-registry";
import { SlashCommandRegistry } from "../lib/slash-command-lib/slash-command-registry/slash-command-registry";
import { SystemAttachmentRegistry } from "../lib/system-lib/registry/system-attachment-registry";
import { SystemRegistry } from "../lib/system-lib/registry/system-registry";
import { TechRegistry } from "../lib/tech-lib/registry/tech-registry";
import { UnitAttrsRegistry } from "../lib/unit-lib/registry/unit-attrs-registry";
import { UnitModifierRegistry } from "../lib/unit-lib/registry/unit-modifier-registry";
import { UseStreamerBuddy } from "../lib/streamer-lib/use-streamer-buddy/use-streamer-buddy";
import { WhisperSpy } from "../lib/streamer-lib/whisper-spy/whisper-spy";
export declare function registerErrorHandler(): void;
export declare class TI4Class {
    readonly locale: {
        (key: string, replacement?: {
            [key: string]: string | number;
        }): string;
        inject(dict: {
            [key: string]: string;
        }): void;
    };
    readonly events: Readonly<GlobalEvents>;
    readonly autoStreamerCamera: AutoStreamerCamera;
    readonly borders: AllBorders;
    readonly config: Config;
    readonly hex: Hex;
    readonly factionRegistry: FactionRegistry;
    readonly gameDataUpdator: GameDataUpdator;
    readonly goalReporter: GoalReporter;
    readonly hideMouseCursor: HideMouseCursor;
    readonly homebrewRegistry: HomebrewRegistry;
    readonly lastGameData: LastGameData;
    readonly planetAttachmentRegistry: PlanetAttachmentRegistry;
    readonly playerActionPhaseTime: PlayerActionPhaseTime;
    readonly playerColor: PlayerColor;
    readonly playerName: PlayerName;
    readonly playerSeats: PlayerSeats;
    readonly removeRegistry: RemoveRegistry;
    readonly slashCommandRegistry: SlashCommandRegistry;
    readonly systemAttachmentRegistry: SystemAttachmentRegistry;
    readonly systemRegistry: SystemRegistry;
    readonly techRegistry: TechRegistry;
    readonly timer: Timer;
    readonly turnOrder: TurnOrder;
    readonly unitAttrsRegistry: UnitAttrsRegistry;
    readonly unitModifierRegistry: UnitModifierRegistry;
    readonly useStreamerBuddy: UseStreamerBuddy;
    readonly whisperSpy: WhisperSpy;
}
declare global {
    var TI4: TI4Class;
}
export declare function resetGlobalThisTI4(): TI4Class;
