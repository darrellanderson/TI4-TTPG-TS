import { GameObject, Vector } from "@tabletop-playground/api";
import { Facing, HexType, NSID, ParsedNSID, PlayerSlot } from "ttpg-darrell";
import { UnitPlastic } from "../../../unit-lib/unit-plastic/unit-plastic";
import { System } from "../../../system-lib/system/system";
import { Planet } from "../../../system-lib/planet/planet";

export type EntityAreaType = "unit" | "token" | "space" | "planet";
export type EntityAreaTypeAndCode = {
  type: EntityAreaType;
  flippable?: boolean;
  code: string;
};

export type EntityType = {
  code: string;
  planetIndex: number; // -1 for space
  count: number;
  colorCode?: string;
  token?: boolean;
  attachment?: boolean;
  hex?: HexType;
};

// Upper case signals color.  No-color entries always first.
const HEX_SUMMARY_COLOR_CODE: Record<string, string> = {
  white: "W",
  blue: "B",
  purple: "P",
  yellow: "Y",
  red: "R",
  green: "G",
  orange: "E", // 'O' vs '0' bad
  pink: "K",
};

const HEX_SUMMARY_UNIT_CODE: Record<string, string> = {
  carrier: "c",
  cruiser: "r",
  destroyer: "y",
  dreadnought: "d",
  fighter: "f",
  flagship: "h",
  infantry: "i",
  pds: "p",
  space_dock: "s",
  war_sun: "w",
  mech: "m",
};

const HEX_SUMMARY_TOKEN_CODE: Record<string, string> = {
  command: "t",
  control: "o",
};

export const ATTACHMENT_NSID_TO_TYPE_AND_CODE: Record<
  string,
  EntityAreaTypeAndCode
> = {
  // SPACE
  "token.attachment.system:base/wormhole-alpha.creuss": {
    type: "space",
    code: "a",
  },
  "token.attachment.system:base/wormhole-beta.creuss": {
    type: "space",
    code: "b",
  },
  "token.attachment.system:pok/wormhole-gamma.creuss": {
    type: "space",
    code: "g",
  },
  "token.attachment.system:pok/wormhole-gamma": { type: "space", code: "g" },
  "token.attachment.system:pok/frontier": { type: "space", code: "e" },
  "token.attachment.system:pok/ion-storm": {
    type: "space",
    code: "n",
    flippable: true,
  },
  "token.attachment.system:pok/dimensional-tear.vuilraith": {
    type: "space",
    code: "h",
  },
  "token.attachment.system:pok/dimensional-tear.nekro": {
    type: "space",
    code: "h",
  },

  // PLANET STATIC
  "token.attachment.planet:pok/demilitarized-zone": {
    type: "planet",
    code: "z",
  },
  "token.attachment.planet:pok/dyson-sphere": {
    type: "planet",
    code: "d",
  },
  "token.attachment.planet:pok/lazax-survivors": {
    type: "planet",
    code: "x",
  },
  "token.attachment.planet:pok/mining-world": {
    type: "planet",
    code: "m",
  },
  "token.attachment.system:pok/mirage": { type: "planet", code: "k" },
  "token.attachment.planet:codex.affinity/nanoforge": {
    type: "planet",
    code: "f",
  },
  "token.attachment.planet:pok/paradise-world": {
    type: "planet",
    code: "p",
  },
  "token.attachment.planet:pok/rich-world": {
    type: "planet",
    code: "r",
  },
  "token.attachment.planet:pok/stellar-converter": {
    type: "planet",
    code: "l",
  },
  "token.attachment.planet:pok/terraform": { type: "planet", code: "t" },
  "token.attachment.planet:pok/sleeper-token": { type: "planet", code: "q" },
  "token.attachment.planet:pok/geoform": { type: "planet", code: "u" },
  "token.attachment.planet:pok/tomb-of-emphidia": {
    type: "planet",
    code: "j",
  },

  // PLANET FLIPPABLE (face down is tech skip side, toggle case for flipped)
  "token.attachment.planet:pok/biotic-research-facility": {
    type: "planet",
    code: "i",
    flippable: true,
  },
  "token.attachment.planet:pok/cybernetic-research-facility": {
    type: "planet",
    code: "c",
    flippable: true,
  },
  "token.attachment.planet:pok/propulsion-research-facility": {
    type: "planet",
    code: "o",
    flippable: true,
  },
  "token.attachment.planet:pok/warfare-research-facility": {
    type: "planet",
    code: "w",
    flippable: true,
  },
  "token.attachment.planet:codex.vigil/custodia-vigilia": {
    type: "planet",
    code: "v",
    flippable: true,
  },
};

export class HexSummaryCodes {
  private readonly _hexToSystem: Map<HexType, System> = new Map();

  constructor() {
    for (const system of TI4.systemRegistry.getAllSystemsWithObjs()) {
      const pos: Vector = system.getObj().getPosition();
      const hex: HexType = TI4.hex.fromPosition(pos);
      this._hexToSystem.set(hex, system);
    }
  }

  getHexToSystem(): Map<HexType, System> {
    return this._hexToSystem;
  }

  _getPlanetIndex(obj: GameObject): number {
    const pos: Vector = obj.getPosition();
    const hex: HexType = TI4.hex.fromPosition(pos);
    const system: System | undefined = this._hexToSystem.get(hex);
    if (system) {
      const planet: Planet | undefined = system.getPlanetClosest(pos);
      if (planet) {
        return system.getPlanets().indexOf(planet);
      }
    }
    return -1;
  }

  _colorCode(obj: GameObject): string | undefined {
    const playerSlot: PlayerSlot = obj.getOwningPlayerSlot();
    const colorName: string | undefined =
      TI4.playerColor.getSlotColorName(playerSlot);
    if (colorName) {
      const code: string | undefined =
        HEX_SUMMARY_COLOR_CODE[colorName.toLowerCase()];
      if (code) {
        return code;
      }
    }
    return undefined;
  }

  _unitCode(plastic: UnitPlastic): string | undefined {
    const code: string | undefined = HEX_SUMMARY_UNIT_CODE[plastic.getUnit()];
    return code;
  }

  _tokenCode(obj: GameObject): string | undefined {
    const nsid: string = NSID.get(obj);
    if (nsid.startsWith("token.")) {
      const parsed: ParsedNSID | undefined = NSID.parse(nsid);
      if (parsed) {
        const secondPart: string | undefined = parsed.typeParts[1];
        if (secondPart) {
          const code: string | undefined = HEX_SUMMARY_TOKEN_CODE[secondPart];
          if (code) {
            return code;
          }
        }
      }
    }
    return undefined;
  }

  unitEntity(plastic: UnitPlastic): EntityType | undefined {
    const code: string | undefined = this._unitCode(plastic);
    if (code) {
      const colorCode: string | undefined = this._colorCode(plastic.getObj());
      const count: number = plastic.getCount();
      let planetIndex: number = -1;
      if (plastic.getUnit() === "infantry" || plastic.getUnit() === "mech") {
        planetIndex = this._getPlanetIndex(plastic.getObj());
      }
      const pos: Vector = plastic.getObj().getPosition();
      const hex: HexType = TI4.hex.fromPosition(pos);
      return {
        code,
        colorCode,
        count,
        planetIndex,
        hex,
      };
    }
  }

  tokenEntity(obj: GameObject): EntityType | undefined {
    const code: string | undefined = this._tokenCode(obj);
    if (code) {
      const colorCode: string | undefined = this._colorCode(obj);
      const planetIndex: number = this._getPlanetIndex(obj);
      const pos: Vector = obj.getPosition();
      const hex: HexType = TI4.hex.fromPosition(pos);
      return { code, count: 1, colorCode, planetIndex, token: true, hex };
    }
  }

  attachmentEntity(obj: GameObject): EntityType | undefined {
    const nsid: string = NSID.get(obj);
    const EntityAreaTypeAndCode: EntityAreaTypeAndCode | undefined =
      ATTACHMENT_NSID_TO_TYPE_AND_CODE[nsid];
    if (EntityAreaTypeAndCode) {
      let code: string = EntityAreaTypeAndCode.code;
      if (EntityAreaTypeAndCode.flippable && !Facing.isFaceUp(obj)) {
        code = code.toUpperCase();
      }
      let planetIndex: number = -1;
      if (EntityAreaTypeAndCode.type === "planet") {
        planetIndex = this._getPlanetIndex(obj);
      }

      const pos: Vector = obj.getPosition();
      const hex: HexType = TI4.hex.fromPosition(pos);

      return {
        code,
        count: 1,
        attachment: true,
        planetIndex,
        hex,
      };
    }
  }
}
