import { Color, world } from "@tabletop-playground/api";
import { ColorLib, ColorsType } from "ttpg-darrell";

/**
 * Player color names in seat order, top-left to top-right
 * then bottom-left to bottom-right.
 */
export const ALL_PLAYER_COLOR_NAMES: Array<string> = [
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
export const DEFAULT_SLOT_COLORS: Array<string> = [
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
export class SetupPlayerSlotColors {
  public setup(): void {
    // Always setup for 8 players, games may use fewer.
    const playerSlots: Array<number> = [];
    for (let i = 0; i < ALL_PLAYER_COLOR_NAMES.length; i++) {
      playerSlots.push(10 + i);
    }

    const origColorSlots: Array<number> = [
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
    const reassignSlots: Array<number> = origColorSlots.filter(
      (slot) => !playerSlots.includes(slot)
    );

    // Slots inside the player slot range NOT using a player slot color.
    const availableSlots: Array<number> = playerSlots.filter(
      (slot) => !origColorSlots.includes(slot)
    );

    // Swap so the player colors are assigned to the player slots.
    // This does NOT set them in the correct order, do that next.
    const colorLib: ColorLib = new ColorLib();
    for (let i = 0; i < reassignSlots.length; i++) {
      const oldSlot: number | undefined = reassignSlots[i];
      const newSlot: number | undefined = availableSlots[i];
      if (oldSlot !== undefined && newSlot !== undefined) {
        const oldColorHex: string | undefined = DEFAULT_SLOT_COLORS[oldSlot];
        const newColorHex: string | undefined = DEFAULT_SLOT_COLORS[newSlot];
        if (oldColorHex !== undefined && newColorHex !== undefined) {
          const oldColor: Color = colorLib.parseColorOrThrow(oldColorHex);
          const newColor: Color = colorLib.parseColorOrThrow(newColorHex);
          world.setSlotColor(newSlot, oldColor);
          world.setSlotColor(oldSlot, newColor);
        }
      }
    }

    for (let i = 0; i < ALL_PLAYER_COLOR_NAMES.length; i++) {
      const colorName: string | undefined = ALL_PLAYER_COLOR_NAMES[i];
      if (colorName !== undefined) {
        const colorsType: ColorsType = colorLib.getColorsByNameOrThrow(
          colorName,
          0
        );
        const colorHex: string = colorsType.slot;
        const color: Color = colorLib.parseColorOrThrow(colorHex);
        const slot: number = 10 + i;
        world.setSlotColor(slot, color);
      }
    }
  }
}
