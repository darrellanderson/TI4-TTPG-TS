import {
  Card,
  GameObject,
  ImageWidget,
  refPackageId,
  Vector,
  world,
} from "@tabletop-playground/api";
import { CardUtil, DeletedItemsContainer, Spawn } from "ttpg-darrell";
import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";
import { CreateZoomedUiType } from "../zoomable-ui/zoomable-ui";
import { ZoomableUiFullyClickable } from "../zoomable-ui/zoomable-ui-fully-clickable";

const packageId: string = refPackageId;

export class UnzoomedTechCardMutableUI extends AbstractUI {
  constructor(scale: number, imageWidget: ImageWidget) {
    const resize: number = 0.4;
    const size: UI_SIZE = {
      w: 750 * scale * resize,
      h: 500 * scale * resize,
    };
    imageWidget.setImageSize(size.w, size.h);
    super(imageWidget, size);
  }
}

export class ZoomedTechCardUI extends AbstractUI {
  private readonly _imageWidget: ImageWidget;

  constructor(scale: number, cardJson: string | undefined) {
    const extraScale: number = 1.2;
    const size: UI_SIZE = {
      w: 750 * scale * extraScale,
      h: 500 * scale * extraScale,
    };
    const imageWidget: ImageWidget = new ImageWidget().setImageSize(
      size.w,
      size.h
    );

    if (cardJson) {
      const pos: Vector = new Vector(0, 0, 100);
      const card: GameObject | undefined = world.createObjectFromJSON(
        cardJson,
        pos
      );
      if (card instanceof Card) {
        imageWidget.setSourceCard(card);
      }
      if (card) {
        DeletedItemsContainer.destroyWithoutCopying(card);
      }
    }

    super(imageWidget, size);
    this._imageWidget = imageWidget;
  }
}

export class TechCardMutableUI extends ZoomableUiFullyClickable {
  private readonly _cardUitl: CardUtil = new CardUtil();
  private readonly _imageWidget: ImageWidget;
  private _cardJson: string | undefined = undefined;

  readonly _createZoomedUI: CreateZoomedUiType;

  constructor(scale: number) {
    const imageWidget: ImageWidget = new ImageWidget().setImage(
      "card/technology/unknown/base/base.back.jpg",
      packageId
    );

    const unzoomedUi: AbstractUI = new UnzoomedTechCardMutableUI(
      scale,
      imageWidget
    );

    const createZoomedUI: CreateZoomedUiType = (_scale: number): AbstractUI => {
      return new ZoomedTechCardUI(scale, this._cardJson);
    };

    super(unzoomedUi, scale, createZoomedUI);
    this._imageWidget = imageWidget;
    this._createZoomedUI = createZoomedUI;
  }

  clearCard(): void {
    this._imageWidget.setImage(
      "card/technology/unknown/base/base.back.jpg",
      packageId
    );
    this._cardJson = undefined;
  }

  setCard(card: Card): void {
    this._imageWidget.setSourceCard(card);
    this._cardJson = card.toJSONString();
  }

  /**
   * Spawn a new tech deck to get the card, use then destroy both.
   *
   * @param nsid
   * @returns
   */
  setCardNsid(techNsid: string): void {
    const pos: Vector = new Vector(0, 0, 100);
    const deck: GameObject = Spawn.spawnMergeDecksWithNsidPrefixOrThrow(
      "card.technology",
      pos
    );

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
