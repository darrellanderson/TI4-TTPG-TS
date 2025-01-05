import { Color, GameObject, world } from "@tabletop-playground/api";
import { Find, NSID } from "ttpg-darrell";

/**
 * Change player color.
 *
 * - Recolor status pad.
 * - Recolor command, leader sheets.
 * - Recolor units.
 * - Recolor unit containers.
 * - Recolor command, control tokens.
 * - Recolor faction-extras, command, control containers.
 * - Replace generic-color promissories.
 * - Recolor player area border lines.
 *
 * - Send on color changed event (unit containers).
 *
 * - Card holder hand / secret should automatically pick up slot color change.
 */
export class ChangeColor {
  private readonly _playerSlot: number;
  private readonly _find: Find = new Find();

  private readonly _recolorNsids: Set<string> = new Set<string>([
    "mat:base/status-pad",
    "sheet:base/command",
    "sheet:pok/leader",
    "unit:base/carrier",
    "unit:base/cruiser",
    "unit:base/destroyer",
    "unit:base/dreadnought",
    "unit:base/fighter",
    "unit:base/flagship",
    "unit:base/infantry",
    "unit:base/pds",
    "unit:base/space-dock",
    "unit:base/war-sun",
    "unit:pok/mech",
    "container.unit:base/carrier",
    "container.unit:base/cruiser",
    "container.unit:base/destroyer",
    "container.unit:base/dreadnought",
    "container.unit:base/fighter",
    "container.unit:base/flagship",
    "container.unit:base/infantry",
    "container.unit:base/pds",
    "container.unit:base/space-dock",
    "container.unit:base/war-sun",
    "container.unit:pok/mech",
    "container:base/faction-extras",
    "container.token.command:base/generic",
    "container.token.control:base/generic",
  ]);
  private readonly _recolorNsidPrefixes: Array<string> = [
    "token.command:",
    "token.control:",
  ];

  constructor(playerSlot: number) {
    this._playerSlot = playerSlot;
  }

  _shouldChangeColor(obj: GameObject): boolean {
    const nsid: string = NSID.get(obj);
    const owner: number = obj.getOwningPlayerSlot();
    if (owner === this._playerSlot) {
      if (this._recolorNsids.has(nsid)) {
        return true;
      }
      for (const prefix of this._recolorNsidPrefixes) {
        if (nsid.startsWith(prefix)) {
          return true;
        }
      }
    }
    return false;
  }

  changeColor(newColorName: string, newColorHex: string): void {
    const oldColorName: string = TI4.playerColor.getSlotColorNameOrThrow(
      this._playerSlot
    );

    TI4.playerColor.setSlotColor(this._playerSlot, newColorName, newColorHex);

    const plasticColor: Color = TI4.playerColor.getSlotPlasticColorOrThrow(
      this._playerSlot
    );

    const skipContained: boolean = false; // look inside containers
    for (const obj of world.getAllObjects(skipContained)) {
      if (this._shouldChangeColor(obj)) {
        obj.setPrimaryColor(plasticColor);
      }
    }

    this._recolorPlayerAreaBorderLines();
    this._replaceGenericPromissories(oldColorName, newColorName);
  }

  _recolorPlayerAreaBorderLines(): void {
    const widgetColor: Color = TI4.playerColor.getSlotWidgetColorOrThrow(
      this._playerSlot
    );

    const tag: string = `player-area-${this._playerSlot}`;

    for (const line of world.getDrawingLines()) {
      if (line.tag === tag) {
        line.color = widgetColor;
        world.removeDrawingLineObject(line);
        world.addDrawingLine(line);
      }
    }
  }

  _replaceGenericPromissories(
    oldColorName: string,
    newColorName: string
  ): void {
    const sourceAndName: Array<string> = [
      "base/ceasefire",
      "base/political-secret",
      "base/support-for-the-throne",
      "base/trade-agreement",
      "pok/alliance",
    ];

    ("card.promissory.pink:base/trade-agreement");
    // TODO
  }
}
