"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs-extra"));
const klaw_sync_1 = __importDefault(require("klaw-sync")); // walk file system
const path = __importStar(require("path"));
const templateFilenames = (0, klaw_sync_1.default)("/Users/darrell/TI4-Online/TI4-TTPG/assets/Templates/card", {
    filter: (item) => path.extname(item.path) === ".json",
    nodir: true,
    traverseAll: true,
}).map((item) => item.path);
const cardNsidToTemplateIdAndIndex = {};
templateFilenames.forEach((templateFilename) => {
    const json = fs.readJSONSync(templateFilename);
    const templateId = json.GUID;
    const cardNsids = Object.values(json.CardMetadata);
    cardNsids.forEach((cardNsid, atlasIndex) => {
        if (cardNsidToTemplateIdAndIndex[cardNsid]) {
            throw new Error("already have " + cardNsid);
        }
        cardNsidToTemplateIdAndIndex[cardNsid] = { templateId, atlasIndex };
    });
});
const txt = JSON.stringify(cardNsidToTemplateIdAndIndex, null, 2);
console.log(txt);
//# sourceMappingURL=extract-new-card-nsid-to-template.js.map