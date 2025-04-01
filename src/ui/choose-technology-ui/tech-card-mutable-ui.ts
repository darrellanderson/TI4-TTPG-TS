import {
  Card,
  GameObject,
  ImageWidget,
  LayoutBox,
  refPackageId,
  Vector,
} from "@tabletop-playground/api";
import { CardUtil, DeletedItemsContainer, Spawn } from "ttpg-darrell";
import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";
import { ZoomableUiFullyClickable } from "../zoomable-ui/zoomable-ui-fully-clickable";
import { CreateZoomedUiType } from "ui/zoomable-ui/zoomable-ui";

const packageId: string = refPackageId;

export class UnzoomedTechCardMutableUI extends AbstractUI {
  constructor(scale: number, imageWidget: ImageWidget) {
    const resize: number = 0.48;
    const size: UI_SIZE = {
      w: 750 * scale * resize,
      h: 500 * scale * resize,
    };
    const box: LayoutBox = new LayoutBox()
      .setOverrideWidth(size.w)
      .setOverrideHeight(size.h)
      .setChild(imageWidget);
    super(box, size);
  }
}

export class ZoomedTechCardUI extends AbstractUI {
  private readonly _box: LayoutBox;

  constructor(scale: number, imageWidget: ImageWidget) {
    const extraScale: number = 1.2;
    const size: UI_SIZE = {
      w: 750 * scale * extraScale,
      h: 500 * scale * extraScale,
    };
    const box: LayoutBox = new LayoutBox()
      .setOverrideWidth(size.w)
      .setOverrideHeight(size.h)
      .setChild(imageWidget);
    super(box, size);
    this._box = box;
  }

  onDestroy(): void {
    this._box.setChild(undefined);
  }
}

export class TechCardMutableUI extends ZoomableUiFullyClickable {
  private readonly _cardUitl: CardUtil = new CardUtil();
  private readonly _imageWidget: ImageWidget;
  private readonly _imageWidgetForZoom: ImageWidget;

  constructor(scale: number) {
    const imageWidget: ImageWidget = new ImageWidget().setImage(
      "card/technology/unknown/base/base.back.jpg",
      packageId
    );
    const imageWidgetForZoom: ImageWidget = new ImageWidget().setImage(
      "card/technology/unknown/base/base.back.jpg",
      packageId
    );

    const unzoomedUi: AbstractUI = new UnzoomedTechCardMutableUI(
      scale,
      imageWidget
    );
    const createZoomedUI: CreateZoomedUiType = (_scale: number): AbstractUI => {
      return new ZoomedTechCardUI(scale, this._imageWidgetForZoom);
    };
    super(unzoomedUi, scale, createZoomedUI);
    this._imageWidget = imageWidget;
    this._imageWidgetForZoom = imageWidgetForZoom;
  }

  clearCard(): void {
    this._imageWidget.setImage(
      "card/technology/unknown/base/base.back.jpg",
      packageId
    );
    this._imageWidgetForZoom.setImage(
      "card/technology/unknown/base/base.back.jpg",
      packageId
    );
  }

  setCard(card: Card): void {
    this._imageWidget.setSourceCard(card);
    this._imageWidgetForZoom.setSourceCard(card);
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
