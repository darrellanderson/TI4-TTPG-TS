import {
  globalEvents,
  Player,
  PlayerPermission,
  refPackageId,
  Vector,
  world,
} from "@tabletop-playground/api";
import { HexType, IGlobal, NamespaceId, Window } from "ttpg-darrell";
import { AbstractUI } from "../../ui/abstract-ui/abtract-ui";
import {
  AbstractWindow,
  CreateAbstractUIParams,
  CreateAbstractUIType,
} from "../../ui/abstract-window/abstract-window";
import { CombatUIAllSimple } from "../../ui/combat-ui/combat-ui-all-simple/combat-ui-all-simple";
import { System } from "../../lib/system-lib/system/system";
import { UnitPlastic } from "../../lib/unit-lib/unit-plastic/unit-plastic";
import { PlayerSeatType } from "../../lib/player-lib/player-seats/player-seats";
import {
  CombatRoll,
  CombatRollParams,
} from "../../lib/combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../lib/unit-lib/unit-attrs/unit-attrs";
import { CombatAttrs } from "../../lib/unit-lib/unit-attrs/combat-attrs";

const packageId: string = refPackageId;

export const ACTION_TOGGLE_COMBAT: string = "*Toggle Combat";

export class ToggleCombatWindow implements IGlobal {
  private _window: Window | undefined = undefined;

  readonly _onSystemActivatedHandler = (
    system: System,
    player: Player
  ): void => {
    this._createWindow();

    // Open for players activating or with units in the system.
    const playerSlots: Array<number> = this._getRelevantPlayerSlots(
      system,
      player
    );

    // Add adjacent PDS2 players.
    const adjPds2PlayerSlots: Array<number> =
      this._getAdjPds2PlayerSlots(system);
    for (const playerSlot of adjPds2PlayerSlots) {
      if (!playerSlots.includes(playerSlot)) {
        playerSlots.push(playerSlot);
      }
    }

    // Open windows.
    if (this._window && playerSlots.length > 1) {
      for (const playerSlot of playerSlots) {
        if (!this._window.isAttachedForPlayer(playerSlot)) {
          this._window.toggleForPlayer(playerSlot);
        }
      }
    }

    // Play sound.
    if (playerSlots.length > 1) {
      const startTime: number | undefined = 0;
      const volume: number | undefined = 0.5;
      const loop: boolean | undefined = false;
      const players: PlayerPermission | undefined =
        new PlayerPermission().setPlayerSlots(playerSlots);
      world
        .importSound("combat-start.flac", packageId)
        .play(startTime, volume, loop, players);
    }
  };

  _isAttached(playerSlot: number): boolean {
    return (
      this._window !== undefined && this._window.isAttachedForPlayer(playerSlot)
    );
  }

  _createWindow(): void {
    if (this._window) {
      this._window.destroy();
      this._window = undefined;
    }

    const createAbstractUi: CreateAbstractUIType = (
      params: CreateAbstractUIParams
    ): AbstractUI => {
      return new CombatUIAllSimple(params.scale, params.playerSlot);
    };
    const namespaceId: NamespaceId | undefined = undefined;
    const windowTitle: string = "Combat";
    const abstractWindow: AbstractWindow = new AbstractWindow(
      createAbstractUi,
      namespaceId,
      windowTitle
    );
    this._window = abstractWindow.createWindow();
  }

  /**
   * This window gets recreated whenever a system is activated.
   * Do not use the default toggle action, because it will move
   * to the end of the list on recreate.
   *
   * @param player
   * @param action
   */
  private readonly onCustomAction = (player: Player, action: string): void => {
    if (action === ACTION_TOGGLE_COMBAT) {
      if (this._window) {
        this._window.toggleForPlayer(player.getSlot());
      }
    }
  };

  init(): void {
    this._createWindow(); // empty contents
    TI4.events.onSystemActivated.add(this._onSystemActivatedHandler);

    const tooltip: string = TI4.locale("tooltip.toggle-combat-window");
    world.addCustomAction(ACTION_TOGGLE_COMBAT, tooltip);
    globalEvents.onCustomAction.add(this.onCustomAction);
  }

  /**
   * Activating player, players with units in the system, and players
   * with PDS2 adjacent.
   *
   * @returns
   */
  _getRelevantPlayerSlots(system: System, player: Player): Array<number> {
    const playersSlotsSet: Set<number> = new Set<number>();

    // Activating player.
    playersSlotsSet.add(player.getSlot());

    // Units in system.
    const pos: Vector = system.getObj().getPosition();
    const hex: HexType = TI4.hex.fromPosition(pos);
    UnitPlastic.getAll().forEach((unit: UnitPlastic): void => {
      if (unit.getHex() === hex) {
        playersSlotsSet.add(unit.getOwningPlayerSlot());
      }
    });

    return Array.from(playersSlotsSet);
  }

  _hasAdjPds2(system: System, playerSlot: number): boolean {
    const pos: Vector = system.getObj().getPosition();
    const hex: HexType = TI4.hex.fromPosition(pos);
    const params: CombatRollParams = {
      rollType: "spaceCannonOffense",
      hex,
      activatingPlayerSlot: playerSlot,
      rollingPlayerSlot: playerSlot,
    };
    const combatRoll: CombatRoll = CombatRoll.createCooked(params);

    // Check ALL units for ranged space cannon, it is not just PDS!
    const unitAttrsArray: Array<UnitAttrs> =
      combatRoll.self.unitAttrsSet.getAll();
    for (const unitAttrs of unitAttrsArray) {
      if (combatRoll.self.hasUnitAdj(unitAttrs.getUnit())) {
        const spaceCannon: CombatAttrs | undefined = unitAttrs.getSpaceCannon();
        if (spaceCannon && spaceCannon.getRange() > 0) {
          return true; // Found a unit with a ranged space cannon.
        }
      }
    }
    return false; // No ranged space cannon found.
  }

  _getAdjPds2PlayerSlots(system: System): Array<number> {
    const checkPlayerSlots: Array<number> = TI4.playerSeats
      .getAllSeats()
      .map((playerSeat: PlayerSeatType): number => {
        return playerSeat.playerSlot;
      });

    return checkPlayerSlots.filter((playerSlot: number): boolean => {
      return this._hasAdjPds2(system, playerSlot);
    });
  }
}
