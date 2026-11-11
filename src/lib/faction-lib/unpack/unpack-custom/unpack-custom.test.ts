import { refPackageId } from "@tabletop-playground/api";
import { SourceAndPackageIdSchemaType } from "../../../system-lib/schema/basic-types-schema";
import { Faction } from "../../faction/faction";
import { FactionSchema, FactionSchemaType } from "../../schema/faction-schema";
import { UnpackCustom } from "./unpack-custom";

const packageId: string = refPackageId;

it("unpack/remove", () => {
  let unpackCalls: number = 0;
  let removeCalls: number = 0;
  let customPlayerSlot: number = -1;
  const customFactionUnpack = (playerSlot: number): void => {
    unpackCalls++;
    customPlayerSlot = playerSlot;
  };
  const customFactionRemove = (playerSlot: number): void => {
    removeCalls++;
    customPlayerSlot = playerSlot;
  };

  const sourceAndPackageId: SourceAndPackageIdSchemaType = {
    source: "my-source",
    packageId,
  };
  const factionParams: FactionSchemaType = {
    nsidName: "my-nsid-name",
    name: "my-name",
    abbr: "my-abbr",
    abilities: [],
    commodities: 0,
    factionTechs: ["one", "two"],
    home: 0,
    leaders: {
      agents: [],
      commanders: [],
      heroes: [],
      mechs: [],
    },
    promissories: [],
    startingTechs: [],
    startingUnits: { carrier: 0 },
    unitOverrides: [],
    customFactionUnpack,
    customFactionRemove,
  };

  // Make sure parsing still works!
  FactionSchema.parse(factionParams);

  const faction: Faction = new Faction(sourceAndPackageId, factionParams);
  const playerSlot: number = 10;
  const unpack = new UnpackCustom(faction, playerSlot);

  expect(unpackCalls).toBe(0);
  expect(removeCalls).toBe(0);
  expect(customPlayerSlot).toBe(-1);

  customPlayerSlot = -1;
  unpack.unpack();
  expect(unpackCalls).toBe(1);
  expect(removeCalls).toBe(0);
  expect(customPlayerSlot).toBe(playerSlot);

  customPlayerSlot = -1;
  unpack.remove();
  expect(unpackCalls).toBe(1);
  expect(removeCalls).toBe(1);
  expect(customPlayerSlot).toBe(playerSlot);
});
