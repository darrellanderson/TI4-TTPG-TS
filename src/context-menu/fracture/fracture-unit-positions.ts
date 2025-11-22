import { UnitType } from "../../lib/unit-lib/schema/unit-attrs-schema";

export type FractureUnitPositionType = {
  tile: number;
  unit: UnitType;
  x: number;
  y: number;
};

export const FRACTURE_UNIT_POSITIONS: Array<FractureUnitPositionType> = [
  {
    tile: 901,
    unit: "dreadnought",
    x: 5,
    y: 0,
  },
  {
    tile: 901,
    unit: "dreadnought",
    x: 2.5,
    y: 4.33,
  },
  {
    tile: 901,
    unit: "destroyer",
    x: -1.43,
    y: 4.79,
  },
  {
    tile: 901,
    unit: "infantry",
    x: 1.5,
    y: 2.45,
  },
  {
    tile: 901,
    unit: "infantry",
    x: 3.37,
    y: 1.7,
  },
  {
    tile: 901,
    unit: "infantry",
    x: 1.38,
    y: 0.7,
  },
  {
    tile: 904,
    unit: "carrier",
    x: 1.97,
    y: 1.91,
  },
  {
    tile: 904,
    unit: "fighter",
    x: 3.11,
    y: 3.9,
  },
  {
    tile: 904,
    unit: "fighter",
    x: 0.67,
    y: 5.4,
  },
  {
    tile: 904,
    unit: "fighter",
    x: 1.52,
    y: 3.76,
  },
  {
    tile: 904,
    unit: "fighter",
    x: 2.44,
    y: 5.69,
  },
  {
    tile: 904,
    unit: "infantry",
    x: -1.43,
    y: 2.9,
  },
  {
    tile: 904,
    unit: "infantry",
    x: 3.62,
    y: -0.39,
  },
  {
    tile: 905,
    unit: "cruiser",
    x: 4.99,
    y: 0,
  },
  {
    tile: 905,
    unit: "cruiser",
    x: 4.24,
    y: 1.92,
  },
  {
    tile: 905,
    unit: "infantry",
    x: 1.56,
    y: 0.35,
  },
  {
    tile: 905,
    unit: "infantry",
    x: 1.35,
    y: -1.32,
  },
];
