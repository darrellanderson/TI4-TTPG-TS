/**
 * Player color names in seat order, top-left to top-right
 * then bottom-left to bottom-right.
 */
export declare const ALL_PLAYER_COLOR_NAMES: Array<string>;
/**
 * Compute reworked slot colors based on these defaults, not
 * whatever the current setup is using.
 */
export declare const DEFAULT_SLOT_COLORS: Array<string>;
/**
 * Use player slots 10-18 for players.  This lets new players join without
 * accidentally taking a seated player slot, and simplifies assigning slots
 * to seats.
 */
export declare class SetupPlayerSlotColors {
    setup(): void;
}
