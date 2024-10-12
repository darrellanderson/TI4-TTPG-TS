import { Direction } from "ttpg-darrell";
import { TurnOrderUI } from "./turn-order-ui";

const turnOrder: Array<number> = [10, 11, 12, 13, 14, 15];
const direction: Direction = "forward";
const currentTurn: number = 10;
TI4.turnOrder.setTurnOrder(turnOrder, direction, currentTurn);

new TurnOrderUI().setPlayerCount(6).attachToScreen();
