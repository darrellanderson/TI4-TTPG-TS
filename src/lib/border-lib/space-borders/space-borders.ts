import { HexType } from "ttpg-darrell";
import { ControlSystemType } from "../space-planet-ownership/space-planet-ownership";

export class SpaceBorders {
  private readonly _hexToControlSystemEntry: Map<HexType, ControlSystemType> =
    new Map();
}
