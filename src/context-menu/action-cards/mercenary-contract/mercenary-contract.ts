/**
 * neutral units:
 * 2 infantry
 */

import { AbstractRightClickCard } from "ttpg-darrell";
import { UnitType } from "../../../lib";
import { Color, GameObject, Player, Vector } from "@tabletop-playground/api";

const SPAWN_NSID: string = "card.action:thunders-edge/mercenary-contract";
const ACTION_SPAWN_UNITS: string = "*Spawn Neutral Units";
const SPAWN_UNIT_AND_COUNT: Map<UnitType, number> = new Map([["infantry", 2]]);

const _onCustomAction = (
  card: GameObject,
  _player: Player,
  identifier: string
): void => {
  if (identifier === ACTION_SPAWN_UNITS) {
    const color: Color = TI4.playerColor.getAnonymousPlasticColor();
    const nextPos: Vector = card.getPosition().add([0, 0, 10]);
    for (const [unitType, count] of SPAWN_UNIT_AND_COUNT.entries()) {
      for (let i = 0; i < count; i++) {
        const source: string = unitType === "mech" ? "pok" : "base";
        const nsid: string = `unit:${source}/${unitType}`;
        const pos: Vector = nextPos.add([i * 2, 0, 0]);
        const obj: GameObject = TI4.spawn.spawnOrThrow(nsid, pos);
        obj.snapToGround();

        obj.setPrimaryColor(color);
        obj.setOwningPlayerSlot(19);
      }
      nextPos.y += 2;
    }
  }
};

export class RightClickMercenaryContract extends AbstractRightClickCard {
  constructor() {
    super(SPAWN_NSID, ACTION_SPAWN_UNITS, _onCustomAction);
  }
}
