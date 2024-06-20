import { Vector } from "@tabletop-playground/api";

export class SystemDefaults {
  // Planet radius relative to system tile.
  static readonly PLANET_RADIUS = 3;

  // Home planet positions relative to system tile.
  static readonly HOME_PLANET_POS: { [key: string]: Vector } = {
    POS_1_OF_1: new Vector(0.98, 0, 0),
    POS_1_OF_2: new Vector(3, -1.88, 0),
    POS_2_OF_2: new Vector(-2.7, 2.85, 0),
    POS_1_OF_3: new Vector(0.75, -4.13, 0),
    POS_2_OF_3: new Vector(3.45, 1.95, 0),
    POS_3_OF_3: new Vector(-3.6, 2.85, 0),
  };

  // Planet positions relative to system tile.
  static readonly PLANET_POS: { [key: string]: Vector } = {
    POS_1_OF_1: new Vector(0, 0, 0),
    POS_1_OF_2: new Vector(3, -1.88, 0),
    POS_2_OF_2: new Vector(-3, 1.5, 0),
    POS_1_OF_3: new Vector(0.75, -4.5, 0),
    POS_2_OF_3: new Vector(3, 2.25, 0),
    POS_3_OF_3: new Vector(-4.05, 2.48, 0),
  };
}
