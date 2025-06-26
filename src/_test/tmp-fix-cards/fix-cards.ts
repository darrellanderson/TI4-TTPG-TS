/**
 * Updated card template files broke old saves.
 * This script updates the card template IDs in a VTS file to the new IDs.`
 */

import * as fs from "fs-extra";

import { OLD_TEMPLATE_ID_TO_CARD_NSIDS } from "./old-template-id-to-card-nsids";
import { NEW_CARD_NSID_TO_TEMPLATE_ID_AND_INDEX } from "./new-card-nsid-to-template-id";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const vtsFilename: string | undefined = (process as any).argv[2];
if (!vtsFilename || !vtsFilename.endsWith(".vts")) {
  throw new Error(`bad vtsFilename "${vtsFilename}"`);
}
if (!fs.existsSync(vtsFilename)) {
  throw new Error(`no such file "${vtsFilename}"`);
}

console.log(`processing "${vtsFilename}"`);
const vtsJson = fs.readJSONSync(vtsFilename);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fixJsonObject(json: any): void {
  const objectType: string | undefined = json["objectType"];
  if (objectType === "Bag") {
    _fixBag(json);
  } else if (objectType === "Card") {
    _fixDeck(json);
  } else if (objectType === "CardHolder") {
    _fixCardHolder(json);
  }

  // Recurse.
  if (Array.isArray(json)) {
    json.forEach((item): void => {
      fixJsonObject(item);
    });
  } else if (typeof json === "object") {
    Object.values(json).forEach((value): void => {
      fixJsonObject(value);
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function _fixBag(json: any): void {
  // If this is a bag, itemsJson is an array of JSON-serialized objects.
  const itemsJson: Array<string> | undefined = json["itemsJson"];
  if (!itemsJson) {
    throw new Error("bag missing itemsJson");
  }
  itemsJson.forEach((itemJson, index): void => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let item: any;
    try {
      item = JSON.parse(itemJson);
    } catch (_e) {
      console.warn(`WARNING: could not parse ItemsJson[${index}]`);
      return;
    }

    const objectType: string | undefined = item?.objectType;
    const templateId: string | undefined = item?.templateId;
    const atlasIndex: number | undefined = item?.atlasIndex;

    if (objectType !== "Card") {
      return; // not a card
    }
    if (!templateId || atlasIndex === undefined) {
      throw new Error(
        `card missing templateId or atlasIndex: ${JSON.stringify(item, null, 2)}`
      );
    }

    const cardNsids: Array<string> | undefined =
      OLD_TEMPLATE_ID_TO_CARD_NSIDS[templateId];
    if (!cardNsids) {
      console.log("_fixBag: not our template", templateId);
      return; // not our template
    }

    const cardNsid: string | undefined = cardNsids[atlasIndex];
    if (!cardNsid) {
      throw new Error(
        `no cardNsid for templateId ${templateId} atlasIndex ${atlasIndex}`
      );
    }

    const newTemplateIdAndIndex:
      | { templateId: string; atlasIndex: number }
      | undefined = NEW_CARD_NSID_TO_TEMPLATE_ID_AND_INDEX[cardNsid];
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
function _fixDeck(json: any): void {
  // If this is a deck, stackSerialization is an array of objects.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stack: Array<any> = json["stackSerialization"];
  stack.forEach((entry): void => {
    const index: number | undefined = entry["index"];
    const templateId: string | undefined = entry["templateId"];
    if (index === undefined || !templateId) {
      throw new Error(`deck entry missing index or templateId`);
    }

    const cardNsids: Array<string> | undefined =
      OLD_TEMPLATE_ID_TO_CARD_NSIDS[templateId];
    if (!cardNsids) {
      console.log("_fixDeck: not our template", templateId);
      return; // not our template
    }

    const cardNsid: string | undefined = cardNsids[index];
    if (!cardNsid) {
      throw new Error(
        `no cardNsid for templateId ${templateId} index ${index}`
      );
    }
    const newTemplateIdAndIndex:
      | { templateId: string; atlasIndex: number }
      | undefined = NEW_CARD_NSID_TO_TEMPLATE_ID_AND_INDEX[cardNsid];
    if (!newTemplateIdAndIndex) {
      throw new Error(`_fixDeck: no new template for cardNsid ${cardNsid}`);
    }

    entry["templateId"] = newTemplateIdAndIndex.templateId;
    entry["index"] = newTemplateIdAndIndex.atlasIndex;

    console.log("_fixDeck: FIXED INNER", cardNsid);
  });

  // If this is a singleton card, atlasIndex and templateId are present.
  const templateId: string | undefined = json["templateId"];
  const atlasIndex: number | undefined = json["atlasIndex"];
  if (!templateId || atlasIndex === undefined) {
    throw new Error(`deck missing templateId or atlasIndex`);
  }
  const cardNsids: Array<string> | undefined =
    OLD_TEMPLATE_ID_TO_CARD_NSIDS[templateId];
  if (!cardNsids) {
    console.log("_fixDeck: not our template", templateId);
    return; // not our template
  }

  const cardNsid: string | undefined = cardNsids[atlasIndex];
  if (!cardNsid) {
    throw new Error(
      `no cardNsid for templateId ${templateId} index ${atlasIndex}`
    );
  }
  const newTemplateIdAndIndex:
    | { templateId: string; atlasIndex: number }
    | undefined = NEW_CARD_NSID_TO_TEMPLATE_ID_AND_INDEX[cardNsid];
  if (!newTemplateIdAndIndex) {
    throw new Error(`_fixDeck: no new template for cardNsid ${cardNsid}`);
  }
  json["templateId"] = newTemplateIdAndIndex.templateId;
  json["atlasIndex"] = newTemplateIdAndIndex.atlasIndex;
  console.log("_fixDeck: FIXED OUTER", cardNsid);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function _fixCardHolder(json: any): void {
  // If this is a card holder, cardsJson is an array of JSON-serialized objects.
  const cardsJson: Array<string> | undefined = json["cardsJson"];
  if (!cardsJson) {
    throw new Error("card holder missing cardsJson");
  }
  cardsJson.forEach((cardJson, index): void => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let item: any;
    try {
      item = JSON.parse(cardJson);
    } catch (_e) {
      console.warn(`WARNING: could not parse ItemsJson[${index}]`);
      return;
    }

    const objectType: string | undefined = item?.objectType;
    const templateId: string | undefined = item?.templateId;
    const atlasIndex: number | undefined = item?.atlasIndex;

    if (objectType !== "Card") {
      return; // not a card
    }
    if (!templateId || atlasIndex === undefined) {
      throw new Error(
        `card missing templateId or atlasIndex: ${JSON.stringify(item, null, 2)}`
      );
    }

    const cardNsids: Array<string> | undefined =
      OLD_TEMPLATE_ID_TO_CARD_NSIDS[templateId];
    if (!cardNsids) {
      console.log("_fixCardHolder: not our template", templateId);
      return; // not our template
    }

    const cardNsid: string | undefined = cardNsids[atlasIndex];
    if (!cardNsid) {
      throw new Error(
        `no cardNsid for templateId ${templateId} atlasIndex ${atlasIndex}`
      );
    }

    const newTemplateIdAndIndex:
      | { templateId: string; atlasIndex: number }
      | undefined = NEW_CARD_NSID_TO_TEMPLATE_ID_AND_INDEX[cardNsid];
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
