import {
  AbstractUnpackTestP,
  FACTION,
  PLAYER_SLOT,
} from "../abstract-unpack/abstract-unpack.testp";
import { UnpackAll } from "./unpack-all";

new AbstractUnpackTestP(new UnpackAll(FACTION, PLAYER_SLOT));
