import { SystemTierType } from "lib/system-lib/system/system-tier";
import { HexType } from "ttpg-darrell";

export const SLICE_MAKEUP: ReadonlyArray<SystemTierType> = [
  "high",
  "med",
  "low",
  "red",
  "red",
];

export const SLICE_SHAPE: ReadonlyArray<HexType> = [
  "<0,0,0>", // home system
  "<1,-1,0>", // left
  "<1,0,-1>", // front
  "<0,1,-1>", // right
  "<2,-1,-1>", // left-eq
  "<2,0,-2>", // front-far
];
