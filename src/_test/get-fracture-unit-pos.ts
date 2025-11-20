// Get unit positions for fracture setup.

import { GameObject, Vector } from "@tabletop-playground/api";
import { System, UnitPlastic } from "../lib";
import { HexType, NSID } from "ttpg-darrell";

type FractureUnitType = {
  tile: number;
  nsid: string;
  x: number;
  y: number;
};
const out: Array<FractureUnitType> = [];

const plastics: Array<UnitPlastic> = UnitPlastic.getAll();

TI4.systemRegistry
  .getAllSystemsWithObjs()
  .filter((system: System): boolean => {
    return system.getClass() === "fracture";
  })
  .forEach((system: System) => {
    const tile: number = system.getSystemTileNumber();
    const systemObj: GameObject = system.getObj();
    const systemPos: Vector = systemObj.getPosition();
    const systemHex: HexType = TI4.hex.fromPosition(systemPos);

    plastics
      .filter((plastic: UnitPlastic): boolean => plastic.getHex() === systemHex)
      .forEach((plastic: UnitPlastic): void => {
        const plasticObj: GameObject = plastic.getObj();
        const nsid: string = NSID.get(plasticObj);
        const globalPos: Vector = plasticObj.getPosition();
        const localPos: Vector = systemObj.worldPositionToLocal(globalPos);
        const x: number = localPos.x;
        const y: number = localPos.y;
        out.push({ tile, nsid, x, y });
      });
  });

console.log(JSON.stringify(out, null, 2));
