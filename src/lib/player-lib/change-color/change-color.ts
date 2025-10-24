import {
  Card,
  CardHolder,
  Color,
  GameObject,
  Rotator,
  Vector,
  world,
} from "@tabletop-playground/api";
import { CardUtil, DeletedItemsContainer, Find, NSID } from "ttpg-darrell";

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
  private readonly _cardUtil: CardUtil = new CardUtil();
  private readonly _find: Find = new Find();

  private readonly _recolorNsids: Set<string> = new Set<string>([
    "mat:base/status-pad",
    "sheet:base/command",
    "sheet:pok/leader",
    "tile.system:base/0",
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
    if (oldColorName !== newColorName) {
      this._replaceGenericPromissories(oldColorName, newColorName);
    }
  }

  _recolorPlayerAreaBorderLines(): void {
    const widgetColor: Color = TI4.playerColor.getSlotWidgetColorOrThrow(
      this._playerSlot
    );

    const tag: string = `player-area-${this._playerSlot}`;

    for (const line of world.getDrawingLines()) {
      if (line.tag === tag) {
        world.removeDrawingLineObject(line);
        line.color = widgetColor;
        world.addDrawingLine(line);
      }
    }
  }

  _replaceGenericPromissories(
    oldColorName: string,
    newColorName: string
  ): void {
    const sourcesAndNames: Array<string> = [
      "base/ceasefire",
      "base/political-secret",
      "base/support-for-the-throne",
      "base/trade-agreement",
      "pok/alliance",
    ];

    const _getPromissoryDeck = (): Card => {
      const deck: Card =
        TI4.spawn.spawnMergeDecksWithNsidPrefixOrThrow("card.promissory");
      return deck;
    };
    const promissoryDeck: Card = _getPromissoryDeck();

    const _getGenericPromissoryCard = (deck: Card, wantNsid: string): Card => {
      const cardStack: Card | undefined = this._cardUtil.filterCards(
        deck,
        (nsid: string): boolean => {
          return nsid === wantNsid;
        }
      );
      if (!cardStack || cardStack.getStackSize() !== 1) {
        throw new Error(`Expected 1 card in stack: ${wantNsid}`);
      }
      return cardStack;
    };

    const nsids: Set<string> = new Set(
      sourcesAndNames.map((sourceAndName: string) => {
        return `card.promissory.${oldColorName}:${sourceAndName}`;
      })
    );

    const skipContained: boolean = false; // look inside containers
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (nsids.has(nsid) && obj instanceof Card) {
        const newNsid: string = nsid.replace(oldColorName, newColorName);

        if (obj.isHeld()) {
          obj.release();
        }
        const pos: Vector = obj.getPosition();
        const rot: Rotator = obj.getRotation();

        // If in a card holder (likely) rememeber the holder and index.
        const holder: CardHolder | undefined = obj.getHolder();
        let index: number = -1;
        if (holder) {
          index = holder.getCards().indexOf(obj);
          if (index >= 0) {
            holder.removeAt(index);
          }
        }

        DeletedItemsContainer.destroyWithoutCopying(obj);

        const newCard: Card = _getGenericPromissoryCard(
          promissoryDeck,
          newNsid
        );
        newCard.setPosition(pos);
        newCard.setRotation(rot);

        if (holder) {
          index = Math.min(index, holder.getCards().length);
          holder.insert(newCard, index);
        }
      }
    }
    DeletedItemsContainer.destroyWithoutCopying(promissoryDeck);
  }
}
