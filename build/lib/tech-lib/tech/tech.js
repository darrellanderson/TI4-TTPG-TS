"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tech = void 0;
class Tech {
    static sortByLevel(techs) {
        return techs.sort((a, b) => {
            const aLevel = a.getLevel();
            const bLevel = b.getLevel();
            if (aLevel !== bLevel) {
                return aLevel - bLevel;
            }
            // Break ties by alpha order of name.
            return a.getName().localeCompare(b.getName());
        });
    }
    constructor(source, params) {
        this._source = source;
        this._params = params;
    }
    getColor() {
        return this._params.color;
    }
    getLevel() {
        var _a, _b, _c, _d;
        return (((_a = this._params.prerequisites.blue) !== null && _a !== void 0 ? _a : 0) +
            ((_b = this._params.prerequisites.green) !== null && _b !== void 0 ? _b : 0) +
            ((_c = this._params.prerequisites.red) !== null && _c !== void 0 ? _c : 0) +
            ((_d = this._params.prerequisites.yellow) !== null && _d !== void 0 ? _d : 0));
    }
    getName() {
        return this._params.name;
    }
    getNsid() {
        return `card.technology.${this._params.color}:${this._source}/${this._params.nsidName}`;
    }
    getNsidName() {
        return this._params.nsidName;
    }
    getPrerequisites(color) {
        var _a, _b, _c, _d;
        if (color === "blue") {
            return (_a = this._params.prerequisites.blue) !== null && _a !== void 0 ? _a : 0;
        }
        else if (color === "green") {
            return (_b = this._params.prerequisites.green) !== null && _b !== void 0 ? _b : 0;
        }
        else if (color === "red") {
            return (_c = this._params.prerequisites.red) !== null && _c !== void 0 ? _c : 0;
        }
        else if (color === "yellow") {
            return (_d = this._params.prerequisites.yellow) !== null && _d !== void 0 ? _d : 0;
        }
        return 0;
    }
    isFactionTech() {
        return this._params.isFactionTech ? true : false;
    }
    replacesNsidName() {
        return this._params.replacesNsidName;
    }
}
exports.Tech = Tech;
//# sourceMappingURL=tech.js.map