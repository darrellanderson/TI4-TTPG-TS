import * as fs from "fs-extra";
import klawSync from "klaw-sync"; // walk file system
import * as path from "path";

const templateFilenames: Array<string> = klawSync(
  "/Users/darrell/TI4-Online/TI4-TTPG/assets/Templates/card",
  {
    filter: (item) => path.extname(item.path) === ".json",
    nodir: true,
    traverseAll: true,
  }
).map((item) => item.path);

const cardNsidToTemplateIdAndIndex: {
  [key: string]: { templateId: string; atlasIndex: number };
} = {};

templateFilenames.forEach((templateFilename): void => {
  const json = fs.readJSONSync(templateFilename);
  const templateId = json.GUID;
  const cardNsids: Array<string> = Object.values(json.CardMetadata);
  cardNsids.forEach((cardNsid, atlasIndex): void => {
    if (cardNsidToTemplateIdAndIndex[cardNsid]) {
      throw new Error("already have " + cardNsid);
    }
    cardNsidToTemplateIdAndIndex[cardNsid] = { templateId, atlasIndex };
  });
});

const txt = JSON.stringify(cardNsidToTemplateIdAndIndex, null, 2);
console.log(txt);
