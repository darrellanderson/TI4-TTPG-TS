import { Card, Player, Vector } from "@tabletop-playground/api";
import { AbstractInfantry2, ACTION_NAME } from "./abstract-infantry-2";
import {
  MockCard,
  MockCardHolder,
  MockGameObject,
  MockPlayer,
  MockVector,
} from "ttpg-mock";
import { DiceGroupParams, DiceParams, DiceResult } from "ttpg-darrell";

const MY_NSID: string = "card:source/my-infantry-2";

class MyInfantry2 extends AbstractInfantry2 {
  constructor() {
    super(MY_NSID, 6);
  }
}

it("constructor/init", () => {
  new MyInfantry2().init();
});

it("custom action", () => {
  const card: MockCard = MockCard.simple(MY_NSID);
  MockGameObject.simple("unit:base/infantry");

  new MyInfantry2();

  const player: Player = new MockPlayer();
  card._customActionAsPlayer(player, ACTION_NAME);
});

it("countInfantryOnCard", () => {
  const card: Card = MockCard.simple(MY_NSID);
  MockGameObject.simple("unit:base/infantry");
  MockGameObject.simple("token:base/infantry-1");
  MockGameObject.simple("token:base/infantry-3");

  const myInfantry2 = new MyInfantry2();
  const count: number = myInfantry2.countInfantryOnCard(card);
  expect(count).toBe(5);
});

it("createDiceGroupParams", () => {
  MockCard.simple(MY_NSID);
  MockGameObject.simple("unit:base/infantry");
  const player: Player = new MockPlayer();
  const rollPos: Vector = new MockVector(1, 2, 3);
  const infantryCount: number = 5;

  const myInfantry2 = new MyInfantry2();
  const params: DiceGroupParams = myInfantry2.createDiceGroupParams(
    rollPos,
    player,
    infantryCount
  );

  expect(params.position?.toString()).toEqual(rollPos.toString());
  expect(params.diceParams.length).toEqual(infantryCount);
});

it("getMessage", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });

  const myInfantry2 = new MyInfantry2();
  const rolllPos: Vector = new MockVector(1, 2, 3);
  const player: Player = new MockPlayer({ name: "My-Name", slot: 10 });
  const infantryCount: number = 3;
  const diceGroupParams: DiceGroupParams = myInfantry2.createDiceGroupParams(
    rolllPos,
    player,
    infantryCount
  );

  const diceParams: DiceParams | undefined = diceGroupParams.diceParams[0];
  if (!diceParams) {
    throw new Error("diceParams is undefined");
  }

  const diceResults: Array<DiceResult> = [
    { diceParams, value: 10, hit: true },
    { diceParams, value: 2, hit: false },
    { diceParams, value: 9, hit: true },
  ];
  const msg: string = myInfantry2.getMessage(diceResults, player);
  expect(msg).toEqual("green resurrected 2 infantry: #10, 2, #9");
});

it("_onRollFinished", () => {
  const myInfantry2 = new MyInfantry2();
  const rolllPos: Vector = new MockVector(1, 2, 3);
  const player: Player = new MockPlayer({ name: "My-Name", slot: 10 });
  const infantryCount: number = 3;
  const diceGroupParams: DiceGroupParams = myInfantry2.createDiceGroupParams(
    rolllPos,
    player,
    infantryCount
  );

  const diceParams: DiceParams | undefined = diceGroupParams.diceParams[0];
  if (!diceParams) {
    throw new Error("diceParams is undefined");
  }

  const diceResults: Array<DiceResult> = [
    { diceParams, value: 10, hit: true },
    { diceParams, value: 2, hit: false },
    { diceParams, value: 9, hit: true },
  ];
  myInfantry2._onRollFinished(diceResults, player);
});

it("custom action", () => {
  jest.useFakeTimers();

  new MyInfantry2().init();
  const card: MockCard = MockCard.simple(MY_NSID);
  process.flushTicks();

  const player: Player = new MockPlayer();
  card._customActionAsPlayer(player, ACTION_NAME);

  jest.clearAllTimers();
});
