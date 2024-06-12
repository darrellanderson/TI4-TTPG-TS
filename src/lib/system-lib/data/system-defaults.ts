import { Vector } from "@tabletop-playground/api";

export class SystemDefaults {
  // Planet radius relative to system tile.
  static readonly PLANET_RADIUS = 2;

  // Home planet positions relative to system tile.
  static readonly HOME_PLANET_POS: { [key: string]: Vector } = {
    POS_1_OF_1: new Vector(0.65, 0, 0),
    POS_1_OF_2: new Vector(2, -1.25, 0),
    POS_2_OF_2: new Vector(-1.8, 1.9, 0),
    POS_1_OF_3: new Vector(0.5, -2.75, 0),
    POS_2_OF_3: new Vector(2.3, 1.3, 0),
    POS_3_OF_3: new Vector(-2.4, 1.9, 0),
  };

  // Planet positions relative to system tile.
  static readonly PLANET_POS: { [key: string]: Vector } = {
    POS_1_OF_1: new Vector(0, 0, 0),
    POS_1_OF_2: new Vector(2, -1.25, 0),
    POS_2_OF_2: new Vector(-2, 1, 0),
    POS_1_OF_3: new Vector(0.5, -3, 0),
    POS_2_OF_3: new Vector(2, 1.5, 0),
    POS_3_OF_3: new Vector(-2.7, 1.65, 0),
  };
}
