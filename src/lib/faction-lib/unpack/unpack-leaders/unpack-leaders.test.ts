import {
  MockCard,
  MockCardDetails,
  MockCardHolder,
  MockGameObject,
  MockRotator,
  MockSnapPoint,
} from "ttpg-mock";
import { Faction } from "../../faction/faction";
import { UnpackLeaders } from "./unpack-leaders";
import { Card, GameObject, Rotator, SnapPoint } from "@tabletop-playground/api";

it("unpack/remove", () => {
  const faction: Faction = new Faction(
    {
      source: "my-source",
      packageId: "my-package-id",
    },
    {
      nsidName: "my-nsid-name",
      name: "my-name",
      abbr: "my-abbr",
      abilities: ["my-ability"],
      commodities: 1,
      home: -123456789,
      homeSurrogate: 3,
      leaders: {
        agents: [],
        commanders: [],
        heroes: [],
        mechs: [],
      },
      promissories: ["my-promissory"],
      startingTechs: ["my-starting-tech"],
      startingUnits: { carrier: 0 },
      factionTechs: ["one", "two"],
      unitOverrides: ["my-unit-override", "my-mech"],
    }
  );
  const playerSlot: number = 10;

  new MockGameObject({
    templateMetadata: "sheet:pok/leader",
    owningPlayerSlot: playerSlot,
    snapPoints: [
      new MockSnapPoint(),
      new MockSnapPoint(),
      new MockSnapPoint(),
      new MockSnapPoint(),
    ],
  });

  const unpack = new UnpackLeaders(faction, playerSlot);
  unpack.unpack();
  unpack.remove();
});

it("unpack (wrong snap point count)", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  new MockGameObject({
    templateMetadata: "sheet:pok/leader",
    owningPlayerSlot: playerSlot,
    snapPoints: [new MockSnapPoint(), new MockSnapPoint(), new MockSnapPoint()],
  });

  const unpack = new UnpackLeaders(faction, playerSlot);
  expect(() => unpack.unpack()).toThrow(/snap points/);
});

it("_findLeaderSheetOrThrow", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const leaderSheet: GameObject = new MockGameObject({
    templateMetadata: "sheet:pok/leader",
    owningPlayerSlot: playerSlot,
  });

  const unpack = new UnpackLeaders(faction, playerSlot);
  const found: GameObject = unpack._findLeaderSheetOrThrow();
  expect(found).toEqual(leaderSheet);
});

it("_findLeaderSheetOrThrow (missing)", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const unpack = new UnpackLeaders(faction, playerSlot);
  expect(() => unpack._findLeaderSheetOrThrow()).toThrow();
});

it("_unpackLeaders", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const nsid: string = "card.leader.agent:pok/letani-ospha";
  const deck: Card = new MockCard({
    cardDetails: [new MockCardDetails({ metadata: nsid })],
  });

  const snapPoint: SnapPoint = new MockSnapPoint();
  const rot: Rotator = new MockRotator(0, 0, 0);

  const unpack = new UnpackLeaders(faction, playerSlot);
  unpack._unpackLeaders(deck, [nsid], snapPoint, rot);
});

it("_unpackLeaders (missing cards)", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const nsid: string = "card.leader.agent:pok/letani-ospha";
  const deck: Card = new MockCard({});

  const snapPoint: SnapPoint = new MockSnapPoint();
  const rot: Rotator = new MockRotator(0, 0, 0);

  const unpack = new UnpackLeaders(faction, playerSlot);
  expect(() => unpack._unpackLeaders(deck, [nsid], snapPoint, rot)).toThrow(
    /Leaders not found/
  );
});

it("remove find card", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: playerSlot,
  });
  const card: Card = MockCard.simple("card.leader.agent:pok/letani-ospha");
  expect(card.isValid()).toBeTruthy();

  const unpack = new UnpackLeaders(faction, playerSlot);
  unpack.remove();

  expect(card.isValid()).toBeFalsy();
});
