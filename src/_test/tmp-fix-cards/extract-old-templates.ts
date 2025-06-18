import * as fs from "fs-extra";
import klawSync from "klaw-sync";
import * as path from "path";

const templateFilenames: Array<string> = klawSync(
  "/Users/darrell/Downloads/t/Templates/card",
  {
    filter: (item) => path.extname(item.path) === ".json",
    nodir: true,
    traverseAll: true,
  }
).map((item) => item.path);

const templateIdToCardNsids: { [key: string]: Array<string> } = {};

templateFilenames.forEach((templateFilename): void => {
  const json = fs.readJSONSync(templateFilename);
  const templateId = json.GUID;
  const cardNsids: Array<string> = Object.values(json.CardMetadata);
  if (templateIdToCardNsids[templateId]) {
    throw new Error("already have " + templateId);
  }
  templateIdToCardNsids[templateId] = cardNsids;
});

const txt = JSON.stringify(templateIdToCardNsids, null, 2);
console.log(txt);
