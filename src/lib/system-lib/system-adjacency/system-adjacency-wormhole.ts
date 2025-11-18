import { Card, GameObject, Vector } from "@tabletop-playground/api";
import { Adjacency, Atop, CardUtil, Find, HexType } from "ttpg-darrell";
import { System } from "../system/system";
import { UnitModifierActiveIdle } from "../../unit-lib/unit-modifier/unit-modifier-active-idle";
import { Faction } from "../../faction-lib/faction/faction";
import { OnSystemActivated } from "../../../event/on-system-activated/on-system-activated";
import { Planet } from "../planet/planet";
import { ControlSystemType, SpacePlanetOwnership } from "../../border-lib";

/**
 * Reminder: an attachment can destroy a wormhole, handled by system.ts
 */
export class SystemAdjacencyWormhole {
  public static WORMHOLES: Array<string> = [
    "alpha",
    "beta",
    "gamma",
    "delta",
    // do not include epsilon (restricted to sundered ability)
  ];

  private readonly _cardUtil: CardUtil = new CardUtil();
  private readonly _find: Find = new Find();

  public static getCombatArenaObj(): GameObject | undefined {
    const matNsid: string = "mat:base/combat-arena";
    TI4.findTracking.trackNsid(matNsid);
    return TI4.findTracking.find(matNsid)[0];
  }

  /**
   * Get the hex for a position, with support for treating the
   * combat arena as the active system.
   *
   * @param pos
   * @returns
   */
  static getSystemHex(pos: Vector): HexType {
    const combatArenaObj: GameObject | undefined =
      SystemAdjacencyWormhole.getCombatArenaObj();
    if (combatArenaObj) {
      const atop: Atop = new Atop(combatArenaObj);
      if (atop.isAtop(pos)) {
        // Position in the combat arena, use the active system.
        const activeSystem: System | undefined =
          OnSystemActivated.getLastActivatedSystem();
        if (activeSystem) {
          const systemPos: Vector = activeSystem.getObj().getPosition();
          return TI4.hex.fromPosition(systemPos);
        }
      }
    }
    return TI4.hex.fromPosition(pos);
  }

  _useWormhole(wormhole: string, faction: Faction | undefined): boolean {
    if (
      wormhole === "epsilon" &&
      (!faction || !faction.getAbilityNsidNames().includes("sundered"))
    ) {
      return false;
    }
    return true;
  }

  _getFlagship(playerSlot: number): GameObject | undefined {
    const nsid: string = "unit:base/flagship";
    TI4.findTracking.trackNsid(nsid);
    const objs: Array<GameObject> = TI4.findTracking.find(nsid);
    for (const obj of objs) {
      const ownerSlot: number = obj.getOwningPlayerSlot();
      if (ownerSlot === playerSlot) {
        return obj;
      }
    }
  }

  public addTags(
    hexToSystem: Map<HexType, System>,
    adjacency: Adjacency,
    faction: Faction | undefined
  ): void {
    // Add wormholes in systems (inclues attachments).
    for (const [hex, system] of hexToSystem) {
      for (const wormhole of system.getWormholes()) {
        if (this._useWormhole(wormhole, faction)) {
          // System into wormhole.
          adjacency.addLink({
            src: hex,
            dst: wormhole,
            distance: 0.5,
            isTransit: true,
          });

          // Wormhole into system.
          adjacency.addLink({
            src: wormhole,
            dst: hex,
            distance: 0.5,
            isTransit: false,
          });
        }
      }
    }

    if (faction) {
      this._applyFaction(faction, adjacency);
    }
    this._applyCreussFlagship(adjacency);
    this._applyCards(adjacency);
    this._applyLazaxGateFolding(adjacency);
    this._applyQuantumEntanglementTF(faction, adjacency);
    this._applyEnigmaticGenomeTF(adjacency);
  }

  _applyFaction(faction: Faction, adjacency: Adjacency): void {
    if (
      faction
        .getAbilityNsids()
        .includes("faction-ability:base/quantum-entanglement")
    ) {
      adjacency.addLink({
        src: "alpha",
        dst: "beta",
        distance: 0,
        isTransit: true,
      });
      adjacency.addLink({
        src: "beta",
        dst: "alpha",
        distance: 0,
        isTransit: true,
      });
    }
  }

  _applyCreussFlagship(adjacency: Adjacency): void {
    const creussPlayerSlot: number | undefined =
      TI4.factionRegistry.getPlayerSlotByFactionNsid("faction:base/creuss");

    if (creussPlayerSlot !== undefined) {
      const creussFlagship: GameObject | undefined =
        this._getFlagship(creussPlayerSlot);
      if (creussFlagship) {
        const pos: Vector = creussFlagship.getPosition();
        const hex: HexType = SystemAdjacencyWormhole.getSystemHex(pos);
        adjacency.addLink({
          src: hex,
          dst: "delta",
          distance: 0.5,
          isTransit: true,
        });
        adjacency.addLink({
          src: "delta",
          dst: hex,
          distance: 0.5,
          isTransit: false,
        });
      }
    }
  }

  _isNekroZTokenInCreussArea(): boolean {
    // Look for a z-token in creuss area.
    const nsid: string = "token:thunders-edge/nekro.z";
    TI4.findTracking.trackNsid(nsid);
    const objs: Array<GameObject> = TI4.findTracking.find(nsid);
    for (const obj of objs) {
      const pos: Vector = obj.getPosition();
      const playerSlot: number = this._find.closestOwnedCardHolderOwner(pos);
      const faction: Faction | undefined =
        TI4.factionRegistry.getByPlayerSlot(playerSlot);
      if (faction && faction.getNsid() === "faction:base/creuss") {
        return true;
      }
    }
    return false;
  }

  _applyNekroFlagship(adjacency: Adjacency): void {
    const nekroPlayerSlot: number | undefined =
      TI4.factionRegistry.getPlayerSlotByFactionNsid("faction:base/nekro");

    if (nekroPlayerSlot !== undefined) {
      const nekroFlagship: GameObject | undefined =
        this._getFlagship(nekroPlayerSlot);
      if (nekroFlagship) {
        if (this._isNekroZTokenInCreussArea()) {
          // Nekro flagship with z-token in Creuss area.
          const flagshipPos: Vector = nekroFlagship.getPosition();
          const hex: HexType =
            SystemAdjacencyWormhole.getSystemHex(flagshipPos);
          adjacency.addLink({
            src: hex,
            dst: "delta",
            distance: 0.5,
            isTransit: true,
          });
          adjacency.addLink({
            src: "delta",
            dst: hex,
            distance: 0.5,
            isTransit: false,
          });
        }
      }
    }
  }

  _applyCards(adjacency: Adjacency): void {
    let nsid: string;
    let card: Card | undefined;
    const allowFaceDown: boolean = false;
    const rejectSnapPointTags: Array<string> = [
      "discard-agenda",
      "discard-action",
    ];

    nsid = "card.agenda:base/wormhole-reconstruction";
    TI4.findTracking.trackNsid(nsid);
    card = TI4.findTracking.findCard(
      "card.agenda:base/wormhole-reconstruction"
    );
    if (
      card &&
      this._cardUtil.isLooseCard(card, allowFaceDown, rejectSnapPointTags)
    ) {
      adjacency.addLink({
        src: "alpha",
        dst: "beta",
        distance: 0,
        isTransit: true,
      });
      adjacency.addLink({
        src: "beta",
        dst: "alpha",
        distance: 0,
        isTransit: true,
      });
    }

    nsid = "card.action:base/lost-star-chart";
    TI4.findTracking.trackNsid(nsid);
    card = TI4.findTracking.findCard(nsid);
    if (
      card &&
      this._cardUtil.isLooseCard(card, allowFaceDown, rejectSnapPointTags)
    ) {
      adjacency.addLink({
        src: "alpha",
        dst: "beta",
        distance: 0,
        isTransit: true,
      });
      adjacency.addLink({
        src: "beta",
        dst: "alpha",
        distance: 0,
        isTransit: true,
      });
    }

    // Creuss agent, can be applied for any player.
    // "After a player activates a system that contains a non-delta
    // wormhole: You may exhaust this card; if you do, that system is
    // adjacent to all other systems that contain a wormhole during
    // this tactical action."
    nsid = "card.leader.agent:pok/emissary-taivra";
    TI4.findTracking.trackNsid(nsid);
    card = TI4.findTracking.findCard(nsid);
    if (
      card &&
      this._cardUtil.isLooseCard(card, allowFaceDown, rejectSnapPointTags) &&
      UnitModifierActiveIdle.isActive(card)
    ) {
      for (const a of SystemAdjacencyWormhole.WORMHOLES) {
        for (const b of SystemAdjacencyWormhole.WORMHOLES) {
          if (a !== b) {
            adjacency.addLink({
              src: a,
              dst: b,
              distance: 0,
              isTransit: true,
            });
          }
        }
      }
    }
  }

  /**
   * Twilight's Fall - Lazax Gate Folding
   *
   * During your tactical action treat legendaries you don't control as if
   * they contain alpha and beta wormholes.
   *
   * @param _adjacency
   */
  _applyLazaxGateFolding(adjacency: Adjacency): void {
    const allowFaceDown: boolean = false;
    const nsid: string = "card.tf-ability:twilights-fall/lazax-gate-folding";
    TI4.findTracking.trackNsid(nsid);
    const card: Card | undefined = TI4.findTracking.findCard(nsid);
    if (card && this._cardUtil.isLooseCard(card, allowFaceDown)) {
      // Is it this player's tactical action?
      const pos: Vector = card.getPosition();
      const owner: number = this._find.closestOwnedCardHolderOwner(pos);
      const activePlayerSlot: number | undefined =
        TI4.turnOrder.getCurrentTurn();
      if (activePlayerSlot === owner) {
        const hexes: Set<HexType> = new Set();
        const uncontrolledLegendaries: Array<Planet> =
          this._getUncontrolledLegendaries(owner);
        for (const planet of uncontrolledLegendaries) {
          const planetPos: Vector = planet.getObj().getPosition();
          const hex: HexType = TI4.hex.fromPosition(planetPos);
          hexes.add(hex);
        }

        for (const hex of hexes) {
          adjacency.addLink({
            src: hex,
            dst: "alpha",
            distance: 0.5,
            isTransit: true,
          });
          adjacency.addLink({
            src: "alpha",
            dst: hex,
            distance: 0.5,
            isTransit: false,
          });
          adjacency.addLink({
            src: hex,
            dst: "beta",
            distance: 0.5,
            isTransit: true,
          });
          adjacency.addLink({
            src: "beta",
            dst: hex,
            distance: 0.5,
            isTransit: false,
          });
        }
      }
    }
  }

  _getUncontrolledLegendaries(playerSlot: number): Array<Planet> {
    const legendaries: Array<Planet> = this._getAllLegendaries();
    const controlledPlanetNames: Set<string> =
      this._getPlanetNamesControlledByPlayer(playerSlot);
    return legendaries.filter((planet: Planet): boolean => {
      return !controlledPlanetNames.has(planet.getName());
    });
  }

  _getAllLegendaries(): Array<Planet> {
    const legendaries: Array<Planet> = [];
    TI4.systemRegistry
      .getAllSystemsWithObjs()
      .forEach((system: System): void => {
        system.getPlanets().forEach((planet: Planet): void => {
          if (planet.isLegendary()) {
            legendaries.push(planet);
          }
        });
      });
    return legendaries;
  }

  _getPlanetNamesControlledByPlayer(playerSlot: number): Set<string> {
    const planetNames: Set<string> = new Set();
    const hexToControlSystemEntry: Map<HexType, ControlSystemType> =
      new SpacePlanetOwnership().getHexToControlSystemEntry();
    for (const controlSystemEntry of hexToControlSystemEntry.values()) {
      controlSystemEntry.planetNameToOwningPlayerSlot.forEach(
        (owningPlayerSlot: number, planetName: string) => {
          if (owningPlayerSlot === playerSlot) {
            planetNames.add(planetName);
          }
        }
      );
    }
    return planetNames;
  }

  /**
   * You treat all systems with alpha and beta wormholes as adjacent.
   *
   * @param _adjacency
   */
  _applyQuantumEntanglementTF(
    faction: Faction | undefined,
    adjacency: Adjacency
  ): void {
    const allowFaceDown: boolean = false;
    const nsid: string = "card.tf-ability:twilights-fall/quantum-entanglement";
    TI4.findTracking.trackNsid(nsid);
    const card: Card | undefined = TI4.findTracking.findCard(nsid);
    if (card && this._cardUtil.isLooseCard(card, allowFaceDown)) {
      // Owned by this faction?
      const pos: Vector = card.getPosition();
      const ownerSlot: number = this._find.closestOwnedCardHolderOwner(pos);
      const ownerFaction: Faction | undefined =
        TI4.factionRegistry.getByPlayerSlot(ownerSlot);
      if (
        faction &&
        ownerFaction &&
        faction.getNsid() === ownerFaction.getNsid()
      ) {
        adjacency.addLink({
          src: "alpha",
          dst: "beta",
          distance: 0,
          isTransit: true,
        });
        adjacency.addLink({
          src: "beta",
          dst: "alpha",
          distance: 0,
          isTransit: true,
        });
      }
    }
  }

  /**
   * active/idle.
   * all wormholes are connected.
   *
   * @param _adjacency
   */
  _applyEnigmaticGenomeTF(adjacency: Adjacency): void {
    const allowFaceDown: boolean = false;
    const nsid: string = "card.tf-genome:twilights-fall/enigmatic-genome";
    TI4.findTracking.trackNsid(nsid);
    const card: Card | undefined = TI4.findTracking.findCard(nsid);
    if (
      card &&
      UnitModifierActiveIdle.isActive(card) &&
      this._cardUtil.isLooseCard(card, allowFaceDown)
    ) {
      for (const a of SystemAdjacencyWormhole.WORMHOLES) {
        for (const b of SystemAdjacencyWormhole.WORMHOLES) {
          if (a !== b) {
            adjacency.addLink({
              src: a,
              dst: b,
              distance: 0,
              isTransit: true,
            });
          }
        }
      }
    }
  }
}
