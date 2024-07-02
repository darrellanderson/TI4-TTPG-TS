import { Vector } from "@tabletop-playground/api";
import { UnitType } from "../schema/unit-attrs-schema";
import { MockCard, MockCardHolder, MockGameObject } from "ttpg-mock";

const SELF: number = 1;
const OPPONENT: number = 2;

function placeGameObjects(params: {
  self?: Array<string>;
  selfUnits?: Map<UnitType, number>;
  selfUnitsAdj?: Map<UnitType, number>;
  opponent?: Array<string>;
  opponentUnits?: Map<UnitType, number>;
  opponentUnitsAdj?: Map<UnitType, number>;
}) {
  const selfPos: Vector = new Vector(100, 0, 0);
  const opponentPos: Vector = new Vector(-100, 0, 0);
  const hexPos: Vector = TI4.hex.toPosition("<0,0,0>");
  const adjHexPos: Vector = TI4.hex.toPosition("<1,0,-1>");

  new MockCardHolder({
    owningPlayerSlot: SELF,
    position: selfPos,
  });
  new MockCardHolder({
    owningPlayerSlot: OPPONENT,
    position: opponentPos,
  });

  for (const nsid of params.self ?? []) {
    if (nsid.startsWith("card.")) {
      MockCard.simple(nsid, { position: selfPos });
    } else {
      MockGameObject.simple(nsid, { position: selfPos });
    }
    for (const nsid of params.opponent ?? []) {
      if (nsid.startsWith("card.")) {
        MockCard.simple(nsid, { position: opponentPos });
      } else {
        MockGameObject.simple(nsid, { position: opponentPos });
      }
    }
  }
}

it("placeGameObjects", () => {
  placeGameObjects({
    self: ["card.technology.unit-upgrade:base/carrier-2"],
    selfUnits: new Map([["carrier", 1]]),
    selfUnitsAdj: new Map([["carrier", 1]]),
    opponent: ["card.technology.unit-upgrade:base/carrier-2"],
    opponentUnits: new Map([["carrier", 1]]),
    opponentUnitsAdj: new Map([["carrier", 1]]),
  });
});
