import {
  Card,
  GameObject,
  ImageWidget,
  LayoutBox,
  Vector,
} from "@tabletop-playground/api";
import { CardUtil, DeletedItemsContainer, Spawn } from "ttpg-darrell";
import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";

export class TechCardMutableUI extends AbstractUI {
  private readonly _cardUitl: CardUtil = new CardUtil();
  private readonly _box: LayoutBox;

  constructor(scale: number) {
    const resize: number = 0.48;
    const size: UI_SIZE = {
      w: 750 * scale * resize,
      h: 500 * scale * resize,
    };
    const box: LayoutBox = new LayoutBox()
      .setOverrideWidth(size.w)
      .setOverrideHeight(size.h);
    super(box, size);
    this._box = box;
  }

  clearCard(): void {
    this._box.setChild(undefined);
  }

  setCard(card: Card): void {
    const image: ImageWidget = new ImageWidget();
    image.setSourceCard(card);
    this._box.setChild(image);
  }

  /**
   * Spawn a new tech deck to get the card, use then destroy both.
   *
   * @param nsid
   * @returns
   */
  setCardNsid(techNsid: string): void {
    const nsids: Array<string> = Spawn.getAllNsids().filter((nsid: string) =>
      nsid.startsWith("card.technology")
    );
    const pos: Vector = new Vector(0, 0, 100);
    const deck: GameObject = Spawn.spawnMergeDecksOrThrow(nsids, pos);

    if (deck instanceof Card) {
      const card: Card | undefined = this._cardUitl.filterCards(
        deck,
        (candidateNsid: string): boolean => techNsid === candidateNsid
      );
      if (card) {
        this.setCard(card);
        DeletedItemsContainer.destroyWithoutCopying(card);
      }
    }
    DeletedItemsContainer.destroyWithoutCopying(deck);
  }
}
