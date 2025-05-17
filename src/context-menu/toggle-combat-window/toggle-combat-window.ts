import { Player, Vector } from "@tabletop-playground/api";
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

export class ToggleCombatWindow implements IGlobal {
  private _window: Window | undefined = undefined;

  readonly _onSystemActivatedHandler = (
    system: System,
    player: Player
  ): void => {
    this._createWindow();

    const playerSlots: Array<number> = this._getRelevantPlayerSlots(
      system,
      player
    );
    if (this._window && playerSlots.length > 1) {
      for (const playerSlot of playerSlots) {
        if (!this._window.isAttachedForPlayer(playerSlot)) {
          this._window.toggleForPlayer(playerSlot);
        }
      }
    }
  };

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
    abstractWindow.getMutableWindowParams().addToggleMenuItem = true;
    abstractWindow.getMutableWindowParams().addToggleMenuTooltip = TI4.locale(
      "tooltip.toggle-combat-window"
    );

    this._window = abstractWindow.createWindow();
  }

  init(): void {
    this._createWindow(); // empty contents
    TI4.events.onSystemActivated.add(this._onSystemActivatedHandler);
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
}
