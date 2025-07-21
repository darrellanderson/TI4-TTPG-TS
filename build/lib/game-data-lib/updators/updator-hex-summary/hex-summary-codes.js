"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HexSummaryCodes = exports.ATTACHMENT_NSID_TO_TYPE_AND_CODE = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
// Upper case signals color.  No-color entries always first.
const HEX_SUMMARY_COLOR_CODE = {
    white: "W",
    blue: "B",
    purple: "P",
    yellow: "Y",
    red: "R",
    green: "G",
    orange: "E", // 'O' vs '0' bad
    pink: "K",
};
const HEX_SUMMARY_UNIT_CODE = {
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
const HEX_SUMMARY_TOKEN_CODE = {
    command: "t",
    control: "o",
};
exports.ATTACHMENT_NSID_TO_TYPE_AND_CODE = {
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
class HexSummaryCodes {
    constructor() {
        this._hexToSystem = new Map();
        for (const system of TI4.systemRegistry.getAllSystemsWithObjs()) {
            const pos = system.getObj().getPosition();
            const hex = TI4.hex.fromPosition(pos);
            this._hexToSystem.set(hex, system);
        }
    }
    getHexToSystem() {
        return this._hexToSystem;
    }
    _getPlanetIndex(obj) {
        const pos = obj.getPosition();
        const hex = TI4.hex.fromPosition(pos);
        const system = this._hexToSystem.get(hex);
        if (system) {
            const planet = system.getPlanetClosest(pos);
            if (planet) {
                return system.getPlanets().indexOf(planet);
            }
        }
        return -1;
    }
    _colorCode(obj) {
        const playerSlot = obj.getOwningPlayerSlot();
        const colorName = TI4.playerColor.getSlotColorName(playerSlot);
        if (colorName) {
            const code = HEX_SUMMARY_COLOR_CODE[colorName.toLowerCase()];
            if (code) {
                return code;
            }
        }
        return undefined;
    }
    _unitCode(plastic) {
        const code = HEX_SUMMARY_UNIT_CODE[plastic.getUnit()];
        return code;
    }
    _tokenCode(obj) {
        const nsid = ttpg_darrell_1.NSID.get(obj);
        if (nsid.startsWith("token.")) {
            const parsed = ttpg_darrell_1.NSID.parse(nsid);
            if (parsed) {
                const secondPart = parsed.typeParts[1];
                if (secondPart) {
                    const code = HEX_SUMMARY_TOKEN_CODE[secondPart];
                    if (code) {
                        return code;
                    }
                }
            }
        }
        return undefined;
    }
    unitEntity(plastic) {
        const code = this._unitCode(plastic);
        if (code) {
            const colorCode = this._colorCode(plastic.getObj());
            const count = plastic.getCount();
            let planetIndex = -1;
            if (plastic.getUnit() === "infantry" || plastic.getUnit() === "mech") {
                planetIndex = this._getPlanetIndex(plastic.getObj());
            }
            const pos = plastic.getObj().getPosition();
            const hex = TI4.hex.fromPosition(pos);
            return {
                code,
                colorCode,
                count,
                planetIndex,
                hex,
            };
        }
    }
    tokenEntity(obj) {
        const code = this._tokenCode(obj);
        if (code) {
            const colorCode = this._colorCode(obj);
            const planetIndex = this._getPlanetIndex(obj);
            const pos = obj.getPosition();
            const hex = TI4.hex.fromPosition(pos);
            return { code, count: 1, colorCode, planetIndex, token: true, hex };
        }
    }
    attachmentEntity(obj) {
        const nsid = ttpg_darrell_1.NSID.get(obj);
        const EntityAreaTypeAndCode = exports.ATTACHMENT_NSID_TO_TYPE_AND_CODE[nsid];
        if (EntityAreaTypeAndCode) {
            let code = EntityAreaTypeAndCode.code;
            if (EntityAreaTypeAndCode.flippable && !ttpg_darrell_1.Facing.isFaceUp(obj)) {
                code = code.toUpperCase();
            }
            let planetIndex = -1;
            if (EntityAreaTypeAndCode.type === "planet") {
                planetIndex = this._getPlanetIndex(obj);
            }
            const pos = obj.getPosition();
            const hex = TI4.hex.fromPosition(pos);
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
exports.HexSummaryCodes = HexSummaryCodes;
//# sourceMappingURL=hex-summary-codes.js.map