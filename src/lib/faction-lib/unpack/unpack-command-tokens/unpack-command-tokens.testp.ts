import {
  AbstractUnpackTestP,
  FACTION,
  PLAYER_SLOT,
} from "../abstract-unpack/abstract-unpack.testp";
import { UnpackCommandTokens } from "./unpack-command-tokens";

new AbstractUnpackTestP(new UnpackCommandTokens(FACTION, PLAYER_SLOT));
