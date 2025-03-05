import { GameObject, refObject } from "@tabletop-playground/api";
import { GlowingToken } from "./glowing-token";

const obj: GameObject = refObject;
setTimeout(() => {
  new GlowingToken(obj);
}, 200);
