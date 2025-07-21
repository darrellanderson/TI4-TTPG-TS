"use strict";
/**
 * Updated card template files broke old saves.
 * This script updates the card template IDs in a VTS file to the new IDs.`
 */
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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs-extra"));
const old_template_id_to_card_nsids_1 = require("./old-template-id-to-card-nsids");
const new_card_nsid_to_template_id_1 = require("./new-card-nsid-to-template-id");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const vtsFilename = process.argv[2];
if (!vtsFilename || !vtsFilename.endsWith(".vts")) {
    throw new Error(`bad vtsFilename "${vtsFilename}"`);
}
if (!fs.existsSync(vtsFilename)) {
    throw new Error(`no such file "${vtsFilename}"`);
}
console.log(`processing "${vtsFilename}"`);
const vtsJson = fs.readJSONSync(vtsFilename);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fixJsonObject(json) {
    const objectType = json["objectType"];
    if (objectType === "Bag") {
        _fixBag(json);
    }
    else if (objectType === "Card") {
        _fixDeck(json);
    }
    else if (objectType === "CardHolder") {
        _fixCardHolder(json);
    }
    // Recurse.
    if (Array.isArray(json)) {
        json.forEach((item) => {
            fixJsonObject(item);
        });
    }
    else if (typeof json === "object") {
        Object.values(json).forEach((value) => {
            fixJsonObject(value);
        });
    }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function _fixBag(json) {
    // If this is a bag, itemsJson is an array of JSON-serialized objects.
    const itemsJson = json["itemsJson"];
    if (!itemsJson) {
        throw new Error("bag missing itemsJson");
    }
    itemsJson.forEach((itemJson, index) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let item;
        try {
            item = JSON.parse(itemJson);
        }
        catch (_e) {
            console.warn(`WARNING: could not parse ItemsJson[${index}]`);
            return;
        }
        const objectType = item === null || item === void 0 ? void 0 : item.objectType;
        const templateId = item === null || item === void 0 ? void 0 : item.templateId;
        const atlasIndex = item === null || item === void 0 ? void 0 : item.atlasIndex;
        if (objectType !== "Card") {
            return; // not a card
        }
        if (!templateId || atlasIndex === undefined) {
            throw new Error(`card missing templateId or atlasIndex: ${JSON.stringify(item, null, 2)}`);
        }
        const cardNsids = old_template_id_to_card_nsids_1.OLD_TEMPLATE_ID_TO_CARD_NSIDS[templateId];
        if (!cardNsids) {
            console.log("_fixBag: not our template", templateId);
            return; // not our template
        }
        const cardNsid = cardNsids[atlasIndex];
        if (!cardNsid) {
            throw new Error(`no cardNsid for templateId ${templateId} atlasIndex ${atlasIndex}`);
        }
        const newTemplateIdAndIndex = new_card_nsid_to_template_id_1.NEW_CARD_NSID_TO_TEMPLATE_ID_AND_INDEX[cardNsid];
        if (!newTemplateIdAndIndex) {
            console.warn(`_fixBag: no new template for cardNsid ${cardNsid}`);
            return;
        }
        item["templateId"] = newTemplateIdAndIndex.templateId;
        item["atlasIndex"] = newTemplateIdAndIndex.atlasIndex;
        // Re-serialize.
        json["itemsJson"][index] = JSON.stringify(item);
        console.log("_fixBag: FIXED", cardNsid);
    });
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function _fixDeck(json) {
    // If this is a deck, stackSerialization is an array of objects.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stack = json["stackSerialization"];
    stack.forEach((entry) => {
        const index = entry["index"];
        const templateId = entry["templateId"];
        if (index === undefined || !templateId) {
            throw new Error(`deck entry missing index or templateId`);
        }
        const cardNsids = old_template_id_to_card_nsids_1.OLD_TEMPLATE_ID_TO_CARD_NSIDS[templateId];
        if (!cardNsids) {
            console.log("_fixDeck: not our template", templateId);
            return; // not our template
        }
        const cardNsid = cardNsids[index];
        if (!cardNsid) {
            throw new Error(`no cardNsid for templateId ${templateId} index ${index}`);
        }
        const newTemplateIdAndIndex = new_card_nsid_to_template_id_1.NEW_CARD_NSID_TO_TEMPLATE_ID_AND_INDEX[cardNsid];
        if (!newTemplateIdAndIndex) {
            throw new Error(`_fixDeck: no new template for cardNsid ${cardNsid}`);
        }
        entry["templateId"] = newTemplateIdAndIndex.templateId;
        entry["index"] = newTemplateIdAndIndex.atlasIndex;
        console.log("_fixDeck: FIXED INNER", cardNsid);
    });
    // If this is a singleton card, atlasIndex and templateId are present.
    const templateId = json["templateId"];
    const atlasIndex = json["atlasIndex"];
    if (!templateId || atlasIndex === undefined) {
        throw new Error(`deck missing templateId or atlasIndex`);
    }
    const cardNsids = old_template_id_to_card_nsids_1.OLD_TEMPLATE_ID_TO_CARD_NSIDS[templateId];
    if (!cardNsids) {
        console.log("_fixDeck: not our template", templateId);
        return; // not our template
    }
    const cardNsid = cardNsids[atlasIndex];
    if (!cardNsid) {
        throw new Error(`no cardNsid for templateId ${templateId} index ${atlasIndex}`);
    }
    const newTemplateIdAndIndex = new_card_nsid_to_template_id_1.NEW_CARD_NSID_TO_TEMPLATE_ID_AND_INDEX[cardNsid];
    if (!newTemplateIdAndIndex) {
        throw new Error(`_fixDeck: no new template for cardNsid ${cardNsid}`);
    }
    json["templateId"] = newTemplateIdAndIndex.templateId;
    json["atlasIndex"] = newTemplateIdAndIndex.atlasIndex;
    console.log("_fixDeck: FIXED OUTER", cardNsid);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function _fixCardHolder(json) {
    // If this is a card holder, cardsJson is an array of JSON-serialized objects.
    const cardsJson = json["cardsJson"];
    if (!cardsJson) {
        throw new Error("card holder missing cardsJson");
    }
    cardsJson.forEach((cardJson, index) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let item;
        try {
            item = JSON.parse(cardJson);
        }
        catch (_e) {
            console.warn(`WARNING: could not parse ItemsJson[${index}]`);
            return;
        }
        const objectType = item === null || item === void 0 ? void 0 : item.objectType;
        const templateId = item === null || item === void 0 ? void 0 : item.templateId;
        const atlasIndex = item === null || item === void 0 ? void 0 : item.atlasIndex;
        if (objectType !== "Card") {
            return; // not a card
        }
        if (!templateId || atlasIndex === undefined) {
            throw new Error(`card missing templateId or atlasIndex: ${JSON.stringify(item, null, 2)}`);
        }
        const cardNsids = old_template_id_to_card_nsids_1.OLD_TEMPLATE_ID_TO_CARD_NSIDS[templateId];
        if (!cardNsids) {
            console.log("_fixCardHolder: not our template", templateId);
            return; // not our template
        }
        const cardNsid = cardNsids[atlasIndex];
        if (!cardNsid) {
            throw new Error(`no cardNsid for templateId ${templateId} atlasIndex ${atlasIndex}`);
        }
        const newTemplateIdAndIndex = new_card_nsid_to_template_id_1.NEW_CARD_NSID_TO_TEMPLATE_ID_AND_INDEX[cardNsid];
        if (!newTemplateIdAndIndex) {
            console.warn(`_fixCardHolder: no new template for cardNsid ${cardNsid}`);
            return;
        }
        item["templateId"] = newTemplateIdAndIndex.templateId;
        item["atlasIndex"] = newTemplateIdAndIndex.atlasIndex;
        // Re-serialize.
        json["cardsJson"][index] = JSON.stringify(item);
        console.log("_fixCardHolder: FIXED", cardNsid);
    });
}
// Write before and after files (before b/c formatting changes for diff).
const before = vtsFilename.replace(/\.vts$/, "-before.vts");
fs.writeFileSync(before, JSON.stringify(vtsJson, null, 2));
console.log(`wrote "${before}"`);
fixJsonObject(vtsJson);
const after = vtsFilename.replace(/\.vts$/, "-after.vts");
fs.writeFileSync(after, JSON.stringify(vtsJson, null, 2));
console.log(`wrote "${after}"`);
//# sourceMappingURL=fix-cards.js.map