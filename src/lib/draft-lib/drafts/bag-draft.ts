import {
  Card,
  CardHolder,
  Container,
  GameObject,
  Vector,
} from "@tabletop-playground/api";
import { CardUtil, Find, NamespaceId, PlayerSlot } from "ttpg-darrell";
import { DraftState } from "../draft-state/draft-state";
import {
  GenerateSlices,
  GenerateSlicesParams,
  SliceTiles,
} from "../generate-slices/generate-slices";
import { IDraft } from "./idraft";
import { Milty } from "./milty";
import { System } from "../../system-lib/system/system";
import { Faction } from "../../faction-lib/faction/faction";
import { GenerateFactions } from "../generate-factions";
import { DraftActivityStart } from "../draft-activity-start";

export class BagDraft implements IDraft {
  private readonly _find: Find = new Find();
  private _containerNsid: string = "container:base/bag-draft";
  private _generateSlicesParams: GenerateSlicesParams;
  private _numFactions: number = 0;
  private _useFactionsOnTable: boolean = false;

  constructor() {
    this._generateSlicesParams = new Milty().getGenerateSlicesParams();
  }

  isEnabled(): boolean {
    return true;
  }

  getDraftName(): string {
    return "Bag Draft";
  }

  getGenerateSlicesParams(): GenerateSlicesParams {
    return this._generateSlicesParams;
  }

  /**
   * DOES NOT USE THIS FUNCTION, spawns containers with system tiles
   * in each player area.
   *
   * @param namespaceId
   */
  createEmptyDraftState(_namespaceId: NamespaceId): DraftState {
    throw new Error("Method not implemented.");
  }

  _getSlices(): Array<SliceTiles> {
    return new GenerateSlices(this.getGenerateSlicesParams()).generateSlices(
      TI4.config.playerCount
    );
  }

  _getFactions(): Array<Array<Faction>> {
    let factions: Array<Faction> = [];

    if (this._useFactionsOnTable) {
      factions = DraftActivityStart.getFactionsOnTable();
    } else if (this._numFactions > 0) {
      factions = new GenerateFactions().generate(
        this._numFactions * TI4.config.playerCount
      );
    }

    const result: Array<Array<Faction>> = [];
    factions.forEach((faction: Faction, index: number): void => {
      const seatIndex: number = index % TI4.config.playerCount;
      let seatFactions: Array<Faction> | undefined = result[seatIndex];
      if (!seatFactions) {
        seatFactions = [];
        result[seatIndex] = seatFactions;
      }
      seatFactions.push(faction);
    });
    return result;
  }

  _createContainer(playerSlot: PlayerSlot): Container {
    const cardHolder: CardHolder | undefined =
      this._find.findCardHolderBySlot(playerSlot);
    if (!cardHolder) {
      throw new Error("Card holder not found");
    }
    const pos: Vector = TI4.playerSeats.getDealPosition(playerSlot);

    const above: Vector = pos.add([0, 0, 10]);

    const nsid: string = this._containerNsid;
    const container: GameObject | undefined = TI4.spawn.spawn(nsid, above);
    if (!container || !(container instanceof Container)) {
      throw new Error("Container not created or not a Container");
    }
    container.snapToGround();
    return container;
  }

  _fillContainerSystems(container: Container, slice: SliceTiles): void {
    const tileSet: Set<number> = new Set(slice);

    const skipContained: boolean = false;
    const systems: Array<System> = TI4.systemRegistry
      .getAllSystemsWithObjs(skipContained)
      .filter((system: System): boolean => {
        return tileSet.has(system.getSystemTileNumber());
      });
    if (systems.length !== slice.length) {
      throw new Error("missing systems");
    }

    systems.forEach((system: System): void => {
      const obj: GameObject = system.getObj();
      const containedIn: Container | undefined = obj.getContainer();
      if (containedIn) {
        const pos = containedIn.getPosition().add([0, 0, 10]);
        containedIn.take(obj, pos);
      }
      container.addObjects([obj]);
    });
  }

  _fillContainerFactions(container: Container, factions: Array<Faction>): void {
    if (factions.length === 0) {
      return;
    }

    const nsids: Array<string> = factions.map((faction: Faction): string => {
      return faction.getFactionReferenceCardNsid();
    });

    // Get faction reference deck.
    const find: Find = new Find();
    const deckFactionRefCardsAll: Card | undefined = find.findDeckOrDiscard(
      "deck-faction-reference"
    );
    if (!deckFactionRefCardsAll) {
      throw new Error("Faction reference deck not found");
    }

    // Filter out the factions we want, leave the rest alone.
    const cardUtil: CardUtil = new CardUtil();
    const deckFactionRefCardsUse: Card | undefined = cardUtil.filterCards(
      deckFactionRefCardsAll,
      (nsid: string): boolean => {
        return nsids.includes(nsid);
      }
    );
    if (!deckFactionRefCardsUse) {
      throw new Error("No chosen faction reference cards found");
    }

    // Split into individual cards.
    const cards: Array<Card> = cardUtil.separateDeck(deckFactionRefCardsUse);
    container.addObjects(cards);
  }

  setContainerNsid(nsid: string): this {
    this._containerNsid = nsid;
    return this;
  }

  /**
   * Custom slice parameters (number of blue high, med, low, etc).
   *
   * @param params
   * @returns
   */
  setGenerateSlicesParams(params: GenerateSlicesParams): this {
    this._generateSlicesParams = params;
    return this;
  }

  setNumFactions(numFactions: number): this {
    this._numFactions = numFactions;
    return this;
  }

  setUseFactionsOnTable(useFactionsOnTable: boolean): this {
    this._useFactionsOnTable = useFactionsOnTable;
    return this;
  }

  createDraftObjects(): void {
    const slices: Array<SliceTiles> = this._getSlices();
    const factionsBySeat: Array<Array<Faction>> = this._getFactions();

    for (let seatIndex = 0; seatIndex < TI4.config.playerCount; seatIndex++) {
      const playerSlot: PlayerSlot =
        TI4.playerSeats.getPlayerSlotBySeatIndexOrThrow(seatIndex);
      const container: Container = this._createContainer(playerSlot);

      const slice: SliceTiles | undefined = slices[seatIndex];
      if (slice) {
        this._fillContainerSystems(container, slice);
      }

      const factions: Array<Faction> | undefined = factionsBySeat[seatIndex];
      if (factions && factions.length > 0) {
        this._fillContainerFactions(container, factions);
      }
    }
  }
}
