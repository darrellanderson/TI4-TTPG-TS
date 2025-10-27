import {
  MockCard,
  MockCardDetails,
  MockCardHolder,
  MockContainer,
  MockGameObject,
  MockSnapPoint,
} from "ttpg-mock";
import { AbstractUnpack } from "../abstract-unpack/abstract-unpack";
import { Faction } from "../../../faction-lib/faction/faction";
import { UnpackAll } from "./unpack-all";
import { Spawn } from "ttpg-darrell";
import {
  Card,
  GameObject,
  Rotator,
  SnapPoint,
  Vector,
} from "@tabletop-playground/api";

it("unpack/remove", () => {
  const faction: Faction | undefined =
    globalThis.TI4.factionRegistry.getByNsidOrThrow("faction:base/arborec");
  const playerSlot: number = 10;

  MockGameObject.simple("mat:base/status-pad", {
    owningPlayerSlot: playerSlot,
  });
  new MockGameObject({
    templateMetadata: "sheet:base/command",
    owningPlayerSlot: playerSlot,
  });
  new MockContainer({
    templateMetadata: "container.token.command:base/generic",
    owningPlayerSlot: playerSlot,
  });
  new MockContainer({
    templateMetadata: "container.token.control:base/generic",
    owningPlayerSlot: playerSlot,
  });
  new MockGameObject({ templateMetadata: "token:base/scoreboard" });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: playerSlot,
  });
  new MockContainer({
    templateMetadata: "container:base/faction-extras",
    owningPlayerSlot: playerSlot,
  });
  new MockGameObject({
    templateMetadata: "sheet.faction:base/generic",
    owningPlayerSlot: playerSlot,
  });
  const existingTechDeck: Card = new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.technology.red:base/magen-defense-grid",
      }),
      new MockCardDetails({
        metadata: "card.technology.red:codex.ordinian/magen-defense-grid.omega",
      }),
      new MockCardDetails(),
    ],
  });
  new MockGameObject({
    templateMetadata: "mat.player:base/technology-deck",
    owningPlayerSlot: playerSlot,
    snapPoints: [
      new MockSnapPoint({
        tags: ["deck-technology"],
        snappedObject: existingTechDeck,
      }),
    ],
  });
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

  const carrier: GameObject = new MockGameObject({
    templateMetadata: "unit:base/carrier",
    owningPlayerSlot: playerSlot,
  });
  new MockContainer({
    templateMetadata: "container.unit:base/carrier",
    owningPlayerSlot: playerSlot,
    items: [carrier],
  });

  const cruiser: GameObject = new MockGameObject({
    templateMetadata: "unit:base/cruiser",
    owningPlayerSlot: playerSlot,
  });
  new MockContainer({
    templateMetadata: "container.unit:base/cruiser",
    owningPlayerSlot: playerSlot,
    items: [cruiser],
  });

  const fighter1: GameObject = new MockGameObject({
    templateMetadata: "unit:base/fighter",
    owningPlayerSlot: playerSlot,
  });
  const fighter2: GameObject = new MockGameObject({
    templateMetadata: "unit:base/fighter",
    owningPlayerSlot: playerSlot,
  });
  new MockContainer({
    templateMetadata: "container.unit:base/fighter",
    owningPlayerSlot: playerSlot,
    items: [fighter1, fighter2],
  });

  const infantry1: GameObject = new MockGameObject({
    templateMetadata: "unit:base/infantry",
    owningPlayerSlot: playerSlot,
  });
  const infantry2: GameObject = new MockGameObject({
    templateMetadata: "unit:base/infantry",
    owningPlayerSlot: playerSlot,
  });
  const infantry3: GameObject = new MockGameObject({
    templateMetadata: "unit:base/infantry",
    owningPlayerSlot: playerSlot,
  });
  const infantry4: GameObject = new MockGameObject({
    templateMetadata: "unit:base/infantry",
    owningPlayerSlot: playerSlot,
  });
  new MockContainer({
    templateMetadata: "container.unit:base/infantry",
    owningPlayerSlot: playerSlot,
    items: [infantry1, infantry2, infantry3, infantry4],
  });

  const pds = new MockGameObject({
    templateMetadata: "unit:base/pds",
    owningPlayerSlot: playerSlot,
  });
  new MockContainer({
    templateMetadata: "container.unit:base/pds",
    owningPlayerSlot: playerSlot,
    items: [pds],
  });

  const spaceDock = new MockGameObject({
    templateMetadata: "unit:base/space-dock",
    owningPlayerSlot: playerSlot,
  });
  new MockContainer({
    templateMetadata: "container.unit:base/space-dock",
    owningPlayerSlot: playerSlot,
    items: [spaceDock],
  });

  const planetDeck: Card = new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.planet:base/nestphar",
      }),
      new MockCardDetails({
        metadata: "card.planet:base/_something_else_",
      }),
    ],
  });
  const snapPoint: SnapPoint = new MockSnapPoint({
    tags: ["deck-planet"],
    snappedObject: planetDeck,
  });
  const _mat: GameObject = new MockGameObject({
    snapPoints: [snapPoint],
  });

  // Spawns some decks to find cards.
  const spawnInstance: Spawn = globalThis.TI4.spawn;
  const origSpawn: (
    nsid: string,
    position?: Vector | [x: number, y: number, z: number] | undefined,
    rotation?: Rotator | [pitch: number, yaw: number, roll: number] | undefined
  ) => GameObject | undefined = spawnInstance.spawn;
  jest
    .spyOn(spawnInstance, "spawn")
    .mockImplementation(
      (
        nsid: string,
        position?: Vector | [x: number, y: number, z: number] | undefined,
        rotation?:
          | Rotator
          | [pitch: number, yaw: number, roll: number]
          | undefined
      ): GameObject | undefined => {
        if (nsid === "card.alliance:pok/0") {
          return new MockCard({
            cardDetails: [
              new MockCardDetails({ metadata: "card.alliance:pok/arborec" }),
            ],
          });
        } else if (nsid === "card.promissory:pok/0") {
          return new MockCard({
            cardDetails: [
              new MockCardDetails({ metadata: "card.promissory:base/stymie" }),
              new MockCardDetails({
                metadata: "card.promissory:codex.ordinian/stymie.omega",
              }),
            ],
          });
        } else if (nsid === "card.leader:pok/0") {
          return new MockCard({
            cardDetails: [
              new MockCardDetails({
                metadata: "card.leader.agent:pok/letani-ospha",
              }),
              new MockCardDetails({
                metadata: "card.leader.commander:pok/dirzuga-rophal",
              }),
              new MockCardDetails({
                metadata: "card.leader.hero:pok/letani-miasmiala",
              }),
              new MockCardDetails({
                metadata: "card.leader.mech:pok/letani-behemoth",
              }),
            ],
          });
        } else if (nsid === "card.breakthrough:thunders-edge/0") {
          return new MockCard({
            cardDetails: [
              new MockCardDetails({
                metadata: "card.breakthrough:thunders-edge/psychospore",
              }),
            ],
          });
        }
        return origSpawn.apply(spawnInstance, [nsid, position, rotation]);
      }
    );

  if (!faction) {
    throw new Error("Could not find faction");
  }
  const unpack: AbstractUnpack = new UnpackAll(faction, playerSlot);
  unpack.unpack();
  unpack.remove();
});
