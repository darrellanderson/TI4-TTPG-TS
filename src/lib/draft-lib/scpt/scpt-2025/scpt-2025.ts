import { GameObject, Rotator, Vector, world } from "@tabletop-playground/api";
import { Spawn } from "ttpg-darrell";
import { AbstractScpt } from "../abstract-scpt/abstract-scpt";
import {
  DRAFT_NAMESPACE_ID,
  DraftActivityStartParams,
} from "../../draft-activity-start/draft-activity-start-params";
import { MapStringLoad } from "../../../map-string-lib/map-string/map-string-load";
import { Milty } from "../../drafts/milty";
import { Scpt2024 } from "../scpt-2024/scpt-2024";
import { Scpt2023 } from "../scpt-2023/scpt-2023";
import { Scpt2022 } from "../scpt-2022/scpt-2022";
import { Scpt2021 } from "../scpt-2021/scpt-2021";

export class Scpt2025 extends AbstractScpt {
  getLabel(): string {
    return "#7 (2025)";
  }

  getQual(): DraftActivityStartParams | undefined {
    const slices: Array<string> = [
      "27,73,47,44,26", //
      "30,39,76,80,65",
      "42,64,75,72,49",
      "79,37,50,71,66",
      "34,41,70,78,25",
      "40,20,36,45,74",
    ];
    const labels: Array<string> = [
      "Will, again", //
      "Rigely field (Where the girls go out)",
      "Devil went back down to Velnor (He forgot something)",
      "Yellow slice because it has Hope's End",
      "Gravity's DOOT DOOT",
      "Viva Las Lorxembourg",
    ];

    // Prune to player count.
    const playerCount: number = this.getPlayerCount();
    while (slices.length > playerCount) {
      const index: number = Math.floor(Math.random() * slices.length);
      slices.splice(index, 1);
      labels.splice(index, 1);
    }

    return {
      namespaceId: DRAFT_NAMESPACE_ID,
      draft: new Milty(),
      numSlices: playerCount,
      numFactions: playerCount,
      config: `${slices.join("|")}&labels=${labels.join("|")}`,
    };
  }

  getPrelim(): DraftActivityStartParams | undefined {
    // Choose a prior prelim's slices.
    const candidates: Array<AbstractScpt> = [
      new Scpt2024(),
      new Scpt2023(),
      new Scpt2022(),
      new Scpt2021(),
    ];
    const index: number = Math.floor(Math.random() * candidates.length);
    const scpt: AbstractScpt | undefined = candidates[index];
    if (scpt) {
      const params: DraftActivityStartParams | undefined = scpt.getPrelim();
      if (params) {
        params.numFactions = 6;
        return params;
      }
    }
  }

  getSemi(): DraftActivityStartParams | undefined {
    type FactionsSlicesLabels = {
      factions: Array<string>;
      slices: Array<string>;
      labels: Array<string>;
    };

    const semis: Array<FactionsSlicesLabels> = [
      // 1
      {
        factions: ["naalu", "hacan", "nekro", "jolnar", "letnev", "l1z1x"],
        slices: [
          "40,37,33,21,44",
          "42,50,30,26,36",
          "48,31,29,22,45",
          "39,46,35,24,34",
          "49,38,32,25,41",
          "43,47,28,19,27",
        ],
        labels: ["Vaunt", "Mage", "9 of Spades", "Schroeder", "Magi", "Jaynor"],
      },
      // 2
      {
        factions: ["yin", "hacan", "l1z1x", "mentak", "creuss", "xxcha"],
        slices: [
          "28,30,19,42,48",
          "22,33,37,26,46",
          "36,27,24,40,45",
          "29,31,20,41,48",
          "21,35,32,39,50",
          "34,38,23,25,44",
        ],
        labels: ["Moose", "Brian", "Ginger", "John", "Duke LukeM", "Shorty55"],
      },
      // 3
      {
        factions: [
          "muaat",
          "argent",
          "empyrean",
          "vuilraith",
          "naazrokha",
          "saar",
        ],
        slices: [
          "21,69,68,39,47",
          "29,74,46,64,67",
          "27,37,45,26,78",
          "73,28,43,40,60",
          "19,76,41,79,65",
          "50,70,72,25,20",
        ],
        labels: [
          "Ondra",
          "Wolphin",
          "The Humble Checkmate",
          "teddysjamforyou",
          "HG Kool aid",
          "telagos",
        ],
      },
      // 4
      {
        factions: ["ul", "nomad", "norr", "yssaril", "sol", "mahact"],
        slices: [
          "67,28,50,73,26",
          "27,29,46,45,25",
          "40,37,31,65,41",
          "77,76,68,20,19",
          "79,35,34,64,78",
          "39,66,69,47,74",
        ],
        labels: [
          "codytct",
          "NerfZerg",
          "mantis",
          "nerdY2K",
          "NekroDiesTwice",
          "Jonno",
        ],
      },
      // 5
      {
        factions: ["mahact", "creuss", "yssaril", "empyrean", "l1z1x", "hacan"],
        slices: [
          "73,39,24,80,71",
          "49,79,30,62,76",
          "50,22,59,67,65",
          "47,64,74,37,41",
          "42,26,72,35,77",
          "61,40,70,68,36",
        ],
        labels: [
          "jadiimjedi",
          "Sir Craigsworth",
          "Deshuga",
          "aljce",
          "dzhiriki",
          "Arratain",
        ],
      },
      // 6
      {
        factions: [
          "mentak",
          "yin",
          "keleres-argent",
          "norr",
          "muaat",
          "arborec",
        ],
        slices: [
          "35,25,44,73,49",
          "34,22,67,47,66",
          "27,40,72,79,65",
          "41,32,48,59,69",
          "78,75,42,24,26",
          "39,76,62,80,64",
        ],
        labels: [
          "Walrus Berzerker",
          "The Meta",
          "GreenFlame",
          "catoftheyear",
          "dzhiriki",
          "Fingolfin",
        ],
      },
    ];

    // Technically this should be a player-driven choice, but the compact UI
    // makes that challenging. So we will just pick a random one.
    const choice: number = Math.floor(Math.random() * semis.length);
    const factions: Array<string> = semis[choice]!.factions;
    const slices: Array<string> = semis[choice]!.slices;
    const labels: Array<string> = semis[choice]!.labels;

    return {
      namespaceId: DRAFT_NAMESPACE_ID,
      draft: new Milty(),
      numSlices: 6,
      numFactions: 6,
      config: `${slices.join("|")}&labels=${labels.join("|")}&factions=${factions.join("|")}`,
    };
  }

  getFinal(): DraftActivityStartParams | undefined {
    const slices: Array<string> = [];
    const labels: Array<string> = [];
    const factions: Array<string> = [
      "sol",
      "xxcha",
      "jolnar",
      "keleres-mentak",
      "creuss",
      "naalu",
    ];

    return {
      namespaceId: DRAFT_NAMESPACE_ID,
      draft: new Milty(),
      numSlices: 6,
      numFactions: 6,
      config: `${slices.join("|")}&labels=${labels.join("|")}&factions=${factions.join("|")}`,
      onStart: (): void => {
        this._placeFinalsOuterSystemsAndWormholes();
      },
    };
  }

  /**
   * Place some systems and wormholes away from the main map.
   */
  _placeFinalsOuterSystemsAndWormholes(): void {
    const mapString: string =
      "{-1} -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 0 -1 -1 0 -1 -1 0 -1 -1 0 -1 -1 0 -1 -1 0 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 65 48 47 66 46 49 69";
    new MapStringLoad().load(mapString);

    // Spawn wormhole tokens (only gamma on the map for now, must visit to get others).
    const nsidAndPositions = [
      {
        nsid: "token.attachment.system:pok/wormhole-gamma",
        pos: new Vector(20.375, 13.738, 0),
      },
      {
        nsid: "token.attachment.system:pok/wormhole-gamma",
        pos: new Vector(2.991, 23.931, 0),
      },
      {
        nsid: "token.attachment.system:base/wormhole-alpha.creuss",
        pos: new Vector(16.24, 13.354, 0),
      },
      {
        nsid: "token.attachment.system:base/wormhole-alpha.creuss",
        pos: new Vector(5.706, 21.77, 0),
      },
      {
        nsid: "token.attachment.system:base/wormhole-beta.creuss",
        pos: new Vector(16.088, 15.474, 0),
      },
      {
        nsid: "token.attachment.system:base/wormhole-beta.creuss",
        pos: new Vector(3.957, 20.639, 0),
      },
    ];
    const rot = new Rotator(0, 0, 180);
    // eslint-disable-next-line prefer-const
    for (let { nsid, pos } of nsidAndPositions) {
      pos = pos.multiply(2.5399); // recorded positions in wrong units
      pos.z = world.getTableHeight() + 3;
      const wormhole: GameObject | undefined = Spawn.spawn(nsid, pos, rot);
      if (wormhole) {
        wormhole.snapToGround();
      }
    }
  }
}
