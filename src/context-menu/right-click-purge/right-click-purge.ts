import {
  Card,
  CardDetails,
  Container,
  GameObject,
  globalEvents,
  Player,
  world,
} from "@tabletop-playground/api";
import {
  Broadcast,
  Find,
  IGlobal,
  NSID,
  OnCardBecameSingletonOrDeck,
} from "ttpg-darrell";

// Better to use |purge nsid attibutes.
const ALSO_PURGE_NSIDS: Set<string> = new Set<string>([
  "card.promissory:thunders-edge/black-ops",
  "card.relic:codex.liberation/book-of-latvinia",
]);

export const PURGE_ACTION_NAME: string = "*Purge";

export class RightClickPurge implements IGlobal {
  private readonly _find: Find = new Find();

  private readonly _onObjectCreatedHandler = (obj: GameObject): void => {
    this._maybeAddPurge(obj);
  };

  private readonly _onCardMadeSingletonHandler = (card: Card): void => {
    this._maybeAddPurge(card);
  };

  private readonly _onCardMakeDeckHandler = (card: Card): void => {
    card.removeCustomAction(PURGE_ACTION_NAME);
    card.onCustomAction.remove(this._onCustomActionHandler);
  };

  private readonly _onCustomActionHandler = (
    object: GameObject,
    player: Player,
    identifier: string
  ): void => {
    if (identifier === PURGE_ACTION_NAME) {
      this._purge(object, player.getSlot());
    }
  };

  public static _isPurgeable(obj: GameObject): boolean {
    const nsid: string = NSID.get(obj);

    if (ALSO_PURGE_NSIDS.has(nsid)) {
      return true;
    }

    // NSID marked with purge.
    if (NSID.getExtras(obj).includes("purge")) {
      return true;
    }

    // Relic fragments.
    if (
      nsid.startsWith("card.exploration") &&
      nsid.includes("-relic-fragment")
    ) {
      return true;
    }

    // Most heroes.
    if (
      nsid.startsWith("card.leader.hero:") &&
      nsid !== "card.leader.hero:codex.vigil/xxekir-grom.omega"
    ) {
      return true;
    }

    // TF paradigms.
    if (nsid.startsWith("card.tf-paradigm:")) {
      return true;
    }

    return false;
  }

  init(): void {
    const skipContained: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      this._maybeAddPurge(obj);
    }
    globalEvents.onObjectCreated.add(this._onObjectCreatedHandler);
    OnCardBecameSingletonOrDeck.onSingletonCardCreated.add(
      this._onCardMadeSingletonHandler
    );
    OnCardBecameSingletonOrDeck.onSingletonCardMadeDeck.add(
      this._onCardMakeDeckHandler
    );
  }

  _maybeAddPurge(obj: GameObject): void {
    if (RightClickPurge._isPurgeable(obj)) {
      obj.removeCustomAction(PURGE_ACTION_NAME);
      obj.addCustomAction(PURGE_ACTION_NAME);
      obj.onCustomAction.remove(this._onCustomActionHandler);
      obj.onCustomAction.add(this._onCustomActionHandler);
    }
  }

  _purge(obj: GameObject, playerSlot: number): void {
    const nsid: string = "container:base/purged";
    const containerOwningPlayerSlot: number | undefined = undefined;
    const skipContained: boolean = true;
    const purgeContainer: Container | undefined = this._find.findContainer(
      nsid,
      containerOwningPlayerSlot,
      skipContained
    );
    if (purgeContainer) {
      const playerName: string = TI4.playerName.getBySlot(playerSlot);
      let objectName: string = obj.getName();
      if (obj instanceof Card && obj.getStackSize() === 1) {
        const cardDetails: CardDetails = obj.getCardDetails();
        objectName = cardDetails.name;
      }
      const msg: string = `${playerName} purged ${objectName}`;
      Broadcast.chatAll(msg);

      purgeContainer.addObjects([obj]);
    }
  }
}
