import { Shuffle } from "ttpg-darrell";
import { Faction } from "../../faction-lib/faction/faction";
import { DraftState } from "../draft-state/draft-state";

/**
 * If Keleres AND at least one of their flavors are in the same draft, swap
 * Keleres to a different flavor if the current Keleres flavor's linked
 * faction is chosen by a different player.
 */
export class ResolveConflictsKeleres {
  private readonly _draftState: DraftState;

  /**
   * Get all Keleres flavors, not just any in the draft.
   *
   * @returns
   */
  static getAllKeleresFlavors(): ReadonlyArray<Faction> {
    const nsids: Array<string> = [
      "faction:codex.vigil/keleres-argent",
      "faction:codex.vigil/keleres-mentak",
      "faction:codex.vigil/keleres-xxcha",
    ];
    return nsids.map((nsid) => {
      return TI4.factionRegistry.getByNsidOrThrow(nsid);
    });
  }

  /**
   * Get all linked-to-Keleres factions, not just any in the draft.
   *
   * @returns
   */
  static getAllLinkedFactions(): ReadonlyArray<Faction> {
    return ResolveConflictsKeleres.getAllKeleresFlavors().map(
      (flavor: Faction): Faction =>
        ResolveConflictsKeleres.getLinkedFactionOrThrow(flavor)
    );
  }

  /**
   * Find Keleres in the draft's factions, -1 if missing.
   *
   * @param draftState
   * @returns
   */
  static getKeleresIndex(draftState: DraftState): number {
    return draftState.getFactions().findIndex((faction) => {
      return faction.getNsid().startsWith("faction:codex.vigil/keleres");
    });
  }

  /**
   * Given a Keleres flavor, get the linked non-Keleres faction.
   *
   * @param keleresFaction
   * @returns
   */
  static getLinkedFactionOrThrow(keleresFaction: Faction): Faction {
    const m: RegExpMatchArray | null = keleresFaction
      .getNsid()
      .match(/keleres-(\w+)/);
    const nsidName: string | undefined = m?.[1];
    if (!nsidName) {
      throw new Error("not a keleres faction");
    }
    return TI4.factionRegistry.getByNsidNameOrThrow(nsidName);
  }

  constructor(draftState: DraftState) {
    this._draftState = draftState;
  }

  public resolve(): void {
    const keleresFlavors: ReadonlyArray<Faction> =
      ResolveConflictsKeleres.getAllKeleresFlavors();
    const linkedFactions: ReadonlyArray<Faction> =
      ResolveConflictsKeleres.getAllLinkedFactions();

    // Which linked factions already chosen?
    const chosenLinkedFactions: Array<Faction> = [];
    this._draftState
      .getFactions()
      .forEach((faction: Faction, index: number) => {
        const isLinked: boolean = linkedFactions.includes(faction);
        const isSelected: boolean =
          this._draftState.getFactionIndexToPlayerSlot(index) !== -1;
        if (isLinked && isSelected) {
          chosenLinkedFactions.push(faction);
        }
      });

    // Which flavors are available?
    const availableFlavors: Array<Faction> = [];
    keleresFlavors.forEach((keleresFlavor) => {
      const linkedFaction: Faction =
        ResolveConflictsKeleres.getLinkedFactionOrThrow(keleresFlavor);
      if (!chosenLinkedFactions.includes(linkedFaction)) {
        availableFlavors.push(keleresFlavor);
      }
    });

    // If the current flavor is no longer available, switch to another.
    const keleresIndex: number = ResolveConflictsKeleres.getKeleresIndex(
      this._draftState
    );
    const keleresFaction: Faction | undefined =
      this._draftState.getFactions()[keleresIndex];
    if (keleresFaction && !availableFlavors.includes(keleresFaction)) {
      const newFlavor: Faction = new Shuffle<Faction>().choiceOrThrow(
        availableFlavors
      );
      const factions: Array<Faction> = this._draftState.getFactions();
      factions[keleresIndex] = newFlavor;
      this._draftState.setFactions(factions); // triggers another update
    }
  }
}
