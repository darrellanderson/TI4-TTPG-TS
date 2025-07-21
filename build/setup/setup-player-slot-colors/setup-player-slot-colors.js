"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetupPlayerSlotColors = exports.DEFAULT_SLOT_COLORS = exports.ALL_PLAYER_COLOR_NAMES = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
/**
 * Player color names in seat order, top-left to top-right
 * then bottom-left to bottom-right.
 */
exports.ALL_PLAYER_COLOR_NAMES = [
    "green",
    "red",
    "yellow",
    "purple",
    "blue",
    "white",
    "orange",
    "pink",
];
/**
 * Compute reworked slot colors based on these defaults, not
 * whatever the current setup is using.
 */
exports.DEFAULT_SLOT_COLORS = [
    "#006DDB",
    "#24FF24",
    "#920000",
    "#004949",
    "#490092",
    "#FF6DB6",
    "#DB6D00",
    "#924900",
    "#B6DBFF",
    "#FFFF6D",
    "#009292",
    "#FFB677",
    "#B66DFF",
    "#6DB6FF",
    "#00FFFF",
    "#0000FF",
    "#FF0000",
    "#373737",
    "#FFFFFF",
    "#000000",
];
/**
 * Use player slots 10-18 for players.  This lets new players join without
 * accidentally taking a seated player slot, and simplifies assigning slots
 * to seats.
 */
class SetupPlayerSlotColors {
    setup() {
        // Always setup for 8 players, games may use fewer.
        const playerSlots = [];
        for (let i = 0; i < exports.ALL_PLAYER_COLOR_NAMES.length; i++) {
            playerSlots.push(10 + i);
        }
        const origColorSlots = [
            1, // green
            16, // red
            9, // yellow
            5, // pink
            6, // orange
            4, // purple
            15, // blue
            18, // white
        ];
        // Slots outside the player slot range using a player slot color.
        const reassignSlots = origColorSlots.filter((slot) => !playerSlots.includes(slot));
        // Slots inside the player slot range NOT using a player slot color.
        const availableSlots = playerSlots.filter((slot) => !origColorSlots.includes(slot));
        // Swap so the player colors are assigned to the player slots.
        // This does NOT set them in the correct order, do that next.
        const colorLib = new ttpg_darrell_1.ColorLib();
        for (let i = 0; i < reassignSlots.length; i++) {
            const oldSlot = reassignSlots[i];
            const newSlot = availableSlots[i];
            if (oldSlot !== undefined && newSlot !== undefined) {
                const oldColorHex = exports.DEFAULT_SLOT_COLORS[oldSlot];
                const newColorHex = exports.DEFAULT_SLOT_COLORS[newSlot];
                if (oldColorHex !== undefined && newColorHex !== undefined) {
                    const oldColor = colorLib.parseColorOrThrow(oldColorHex);
                    const newColor = colorLib.parseColorOrThrow(newColorHex);
                    api_1.world.setSlotColor(newSlot, oldColor);
                    api_1.world.setSlotColor(oldSlot, newColor);
                }
            }
        }
        for (let i = 0; i < exports.ALL_PLAYER_COLOR_NAMES.length; i++) {
            const colorName = exports.ALL_PLAYER_COLOR_NAMES[i];
            if (colorName !== undefined) {
                TI4.playerColor.setSlotColor(10 + i, colorName);
            }
        }
    }
}
exports.SetupPlayerSlotColors = SetupPlayerSlotColors;
//# sourceMappingURL=setup-player-slot-colors.js.map