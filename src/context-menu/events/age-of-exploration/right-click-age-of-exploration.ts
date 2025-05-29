import {
  Container,
  GameObject,
  Player,
  Vector,
} from "@tabletop-playground/api";
import { AbstractRightClickCard, PlayerSlot } from "ttpg-darrell";
import { System } from "../../../lib/system-lib/system/system";
import {
  SystemTier,
  SystemTierType,
} from "../../../lib/system-lib/system/system-tier";

export const AGE_OF_EXPLORATION_ACTION_NAME: string = "*Draw system tile";

/**
 * ACTION: ... roll 1 die, on a result of 1-4 draw a random unused red tile,
 * on a result of 5-10 draw a random unused blue tile; place that tile
 * adjacent to any border system that contains your ships.  Place a frontier
 * token in the newly placed system if it does not contain any planets.
 */
export class RightClickAgeOfExploration extends AbstractRightClickCard {
  constructor() {
    const cardNsidPrefix: string =
      "card.event:codex.liberation/age-of-exploration";
    const customActionHandler = (
      _object: GameObject,
      _player: Player,
      _identifier: string
    ): void => {
      // Custom action logic goes here
    };
    super(cardNsidPrefix, AGE_OF_EXPLORATION_ACTION_NAME, customActionHandler);
  }

  _getAvailableLegalSystems(): Array<System> {
    const skipContained: boolean = false;
    return TI4.systemRegistry
      .getAllSystemsWithObjs(skipContained)
      .filter((system: System): boolean => {
        return (
          system.getObj().getContainer() !== undefined &&
          !system.isExcludeFromDraft()
        );
      });
  }

  _getAvailableRedSystems(): Array<System> {
    const systemTier: SystemTier = new SystemTier();
    return this._getAvailableLegalSystems().filter(
      (system: System): boolean => {
        return systemTier.getTier(system) === "red";
      }
    );
  }

  _getAvailableBlueSystems(): Array<System> {
    const systemTier: SystemTier = new SystemTier();
    return this._getAvailableLegalSystems().filter(
      (system: System): boolean => {
        const tier: SystemTierType = systemTier.getTier(system);
        return tier === "high" || tier === "med" || tier === "low";
      }
    );
  }

  _getAvailableSystem(tileColor: "red" | "blue"): System | undefined {
    const systems: Array<System> =
      tileColor === "red"
        ? this._getAvailableRedSystems()
        : this._getAvailableBlueSystems();
    const index: number = Math.floor(Math.random() * systems.length);
    return systems[index];
  }

  _dealSystemTile(playerSlot: PlayerSlot, tileColor: "red" | "blue"): void {
    const system: System | undefined = this._getAvailableSystem(tileColor);
    if (system) {
      const obj: GameObject = system.getObj();
      const pos: Vector = TI4.playerSeats.getDealPosition(playerSlot);
      const container: Container | undefined = obj.getContainer();
      if (container) {
        container.take(obj, pos);
        obj.snapToGround();
      }
    }
  }

  _chooseTileColor(): "red" | "blue" {
    const roll: number = Math.floor(Math.random() * 10) + 1;
    return this._colorFromRoll(roll);
  }

  _colorFromRoll(roll: number): "red" | "blue" {
    return roll <= 4 ? "red" : "blue";
  }
}
