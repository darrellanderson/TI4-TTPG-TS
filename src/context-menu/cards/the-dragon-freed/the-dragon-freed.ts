import {
  Color,
  GameObject,
  Player,
  Vector,
  world,
} from "@tabletop-playground/api";
import {
  AbstractRightClickCard,
  Broadcast,
  Find,
  HexType,
  IGlobal,
} from "ttpg-darrell";
import {
  CombatRoll,
  CombatRollParams,
} from "../../../lib/combat-lib/combat-roll/combat-roll";
import { Faction } from "../../../lib/faction-lib/faction/faction";
import { Planet } from "../../../lib/system-lib/planet/planet";
import { System } from "../../../lib/system-lib/system/system";
import { SystemAdjacency } from "../../../lib/system-lib/system-adjacency/system-adjacency";
import { OnSystemActivated } from "../../../event";
import { CombatAttrs } from "../../../lib";

const NSID_DRAGON_FREED: string =
  "card.tf-unit-upgrade:twilights-fall/the-dragon-freed";
const ACTION_DRAGON_FREED: string = "*Invoke Dragon Freed";
const TOOLTIP_DRAGON_FREED: string =
  "Rolls BOMBARDMENT for planets in active and adjacent systems";

/**
 * "When this (war-sun) unit uses BOMBARDMENT, it uses it against each planet in
 * its system and each adjacent system, even yours, ignoring PLANETARY SHIELD"
 */
export class RightClickTFDragonFreed
  extends AbstractRightClickCard
  implements IGlobal
{
  constructor() {
    const customActionHandler = (
      object: GameObject,
      player: Player,
      identifier: string,
    ): void => {
      if (identifier === ACTION_DRAGON_FREED) {
        this._doDragonFreed(object, player.getSlot());
      }
    };
    super(NSID_DRAGON_FREED, ACTION_DRAGON_FREED, customActionHandler);
    this.setTooltip(ACTION_DRAGON_FREED, TOOLTIP_DRAGON_FREED);
  }

  init(): void {
    super.init();
  }

  _doDragonFreed(
    dragonFreedCard: GameObject,
    clickingPlayerSlot: number,
  ): void {
    const clickingPlayerName: string =
      TI4.playerName.getBySlot(clickingPlayerSlot);

    const find: Find = new Find();
    const cardPos: Vector = dragonFreedCard.getPosition();
    const cardOwnerSlot: number = find.closestOwnedCardHolderOwner(cardPos);
    const color: Color = world.getSlotColor(cardOwnerSlot);

    const activeSystem: System | undefined =
      OnSystemActivated.getLastActivatedSystem();
    if (!activeSystem) {
      Broadcast.chatAll(
        `${clickingPlayerName} invokes The Dragon Freed, no active system`,
        color,
      );
      return;
    }
    const activeSystemPos: Vector = activeSystem.getObj().getPosition();
    const activeSystemHex: HexType = TI4.hex.fromPosition(activeSystemPos);

    const planetNames: Array<string> = this._getLocalAndAdjacentPlanetNames(
      cardOwnerSlot,
      activeSystemHex,
    );

    const bombardmentAttrs: CombatAttrs = this._getWarSunBombardmentAttrs(
      cardOwnerSlot,
      activeSystemHex,
    );
    const bombardmentDice: number =
      bombardmentAttrs.getDice() + bombardmentAttrs.getExtraDice();
    const bombardmentHit: number = bombardmentAttrs.getHit();
    console.log(
      "xxx",
      bombardmentDice,
      bombardmentAttrs.getDice(),
      bombardmentAttrs.getExtraDice(),
    );

    // Should it ignore the planet it is on?  Maybe, but players can manage.
    const perPlanetResults: Array<string> = planetNames.map(
      (planetName: string): string => {
        const diceResults: Array<string> = [];
        let hits: number = 0;
        for (let i = 0; i < bombardmentDice; i++) {
          const diceResult: number = Math.floor(Math.random() * 10) + 1;
          if (diceResult >= bombardmentHit) {
            diceResults.push(`${diceResult}#`);
            hits++;
          } else {
            diceResults.push(`${diceResult}`);
          }
        }
        return [
          ">",
          `${planetName}:`,
          `${hits}`,
          `(${diceResults.join(", ")})`,
        ].join(" ");
      },
    );
    perPlanetResults.sort();

    Broadcast.chatAll(
      `${clickingPlayerName} invokes The Dragon Freed in system ${activeSystem.getSystemTileNumber()}:\n${perPlanetResults.join(
        "\n",
      )}`,
      color,
    );
  }

  _getLocalAndAdjacentPlanetNames(
    playerSlot: number,
    systemHex: HexType,
  ): Array<string> {
    const faction: Faction | undefined =
      TI4.factionRegistry.getByPlayerSlot(playerSlot);

    const adjacency: SystemAdjacency = new SystemAdjacency();
    const hexes: Set<HexType> = adjacency.getAdjHexes(systemHex, faction);
    hexes.add(systemHex);

    const hexToSystem: Map<HexType, System> = SystemAdjacency.getHexToSystem();
    const planetNames: Array<string> = [];
    hexes.forEach((hex: HexType): void => {
      const system: System | undefined = hexToSystem.get(hex);
      if (system) {
        system.getPlanets().forEach((planet: Planet): void => {
          planetNames.push(planet.getName());
        });
      }
    });
    return planetNames;
  }

  _getWarSunBombardmentAttrs(
    playerSlot: number,
    systemHex: HexType,
  ): CombatAttrs {
    const combatParams: CombatRollParams = {
      rollType: "bombardment",
      rollingPlayerSlot: playerSlot,
      activatingPlayerSlot: playerSlot,
      hex: systemHex,
    };
    const combatRoll: CombatRoll = CombatRoll.createCooked(combatParams);
    const bombardmentAttrs: CombatAttrs | undefined =
      combatRoll.getUnitCombatAttrs("war-sun");
    if (!bombardmentAttrs) {
      throw new Error(
        `Dragon Freed: No bombardment attributes found for War Sun in system ${systemHex}`,
      );
    }
    return bombardmentAttrs;
  }
}
