import {
  AbstractUnpackTestP,
  FACTION,
  PLAYER_SLOT,
} from "./abstract-unpack.testp";
import { UnpackCommandControlTokens } from "./unpack-command-control-tokens";

new AbstractUnpackTestP(new UnpackCommandControlTokens(FACTION, PLAYER_SLOT));
