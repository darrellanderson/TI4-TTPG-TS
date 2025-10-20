import {
  Card,
  GameObject,
  Player,
  TraceHit,
  Vector,
  world,
} from "@tabletop-playground/api";
import {
  Broadcast,
  CardUtil,
  Find,
  NSID,
  OnCardBecameSingletonOrDeck,
  PlayerSlot,
  SimpleCardGarbageHandler,
} from "ttpg-darrell";
import {
  InitiativeEntry,
  InitiativeOrder,
} from "../../../../strategy-card-lib";

export class RecycleCardAction extends SimpleCardGarbageHandler {
  private readonly _myCardUtil: CardUtil = new CardUtil();
  private readonly _myFind: Find = new Find();
  private readonly _initiativeOrder: InitiativeOrder = new InitiativeOrder();

  private _dataSkimmerCard: Card | undefined = undefined;

  constructor() {
    super();
    this.setCardNsidPrefix("card.action:")
      .setFaceUp(true)
      .setSnapPointTag("discard-action");

    OnCardBecameSingletonOrDeck.onSingletonCardCreated.add(
      (card: Card, _player?: Player): void => {
        const nsid: string = NSID.get(card);
        if (nsid === "card.breakthrough:thunders-edge/data-skimmer") {
          this._dataSkimmerCard = card;
        }
      }
    );
  }

  recycle(obj: GameObject, player: Player | undefined): boolean {
    // The Ral-Nel breakthrough collects discarded action cards.
    // "During the action phase, if you have not passed, when other players
    // would discard action cards, they are placed on this card instead.
    // When you pass, take 1 action card from this card and discard the rest."
    if (this._dataSkimmer(obj, player)) {
      return true; // data skimmer handled the recycle
    }

    return super.recycle(obj, player);
  }

  _isActionPhase(): boolean {
    const entries: Array<InitiativeEntry> = this._initiativeOrder.get();
    console.log("xxx", entries.length);
    return entries.length >= TI4.config.playerCount;
  }

  _dataSkimmer(obj: GameObject, player: Player | undefined): boolean {
    const isActionPhase: boolean = this._isActionPhase();

    const allowFaceDown: boolean = false;
    if (
      isActionPhase &&
      obj instanceof Card &&
      this._dataSkimmerCard &&
      this._myCardUtil.isLooseCard(this._dataSkimmerCard, allowFaceDown)
    ) {
      const pos: Vector = this._dataSkimmerCard.getPosition();
      const owner: PlayerSlot = this._myFind.closestOwnedCardHolderOwner(pos);
      const isPassed: boolean = TI4.turnOrder.getPassed(owner);
      if (!isPassed) {
        // We have a data skimmer and the owner has not passed.
        // Reject if the owner is the one recycling the card.
        if (player && player.getSlot() === owner) {
          return false; // do not handle the recycle
        }

        const cardName: string = obj.getCardDetails().name;
        Broadcast.chatAll(`recycle sending ${cardName} to data skimmer`);

        // Look for an existing action card/deck on the data skimmer.
        const existingActionCard: Card | undefined =
          this._getExistingActionCard(pos);
        if (existingActionCard) {
          // Report of card below falling through table when adding to deck.
          // Move deck up, add, snap back down.
          existingActionCard.setPosition(pos.add([0, 0, 2]));

          const toFront: boolean = true;
          const offset: number = 0;
          const animate: boolean = true;
          const flipped: boolean = false;
          existingActionCard.addCards(obj, toFront, offset, animate, flipped);

          existingActionCard.snapToGround();
        } else {
          obj.setPosition(pos.add([0, 0, 10]));
          obj.setRotation([0, 0, 180]);
          obj.snapToGround();
        }
        return true; // we handled the recycle
      }
    }
    return false;
  }

  _getExistingActionCard(pos: Vector): Card | undefined {
    const traceSrc: Vector = pos.add([0, 0, 2]);
    const traceDst: Vector = pos.add([0, 0, -2]);
    const objs: Array<GameObject> = world
      .lineTrace(traceSrc, traceDst)
      .map((hit: TraceHit): GameObject => hit.object);
    for (const obj of objs) {
      if (obj instanceof Card) {
        const nsids: Array<string> = NSID.getDeck(obj);
        const first: string | undefined = nsids[0];
        if (first && first.startsWith("card.action:")) {
          return obj;
        }
      }
    }
  }
}
