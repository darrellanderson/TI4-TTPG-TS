import fs from "fs";
import klawSync from "klaw-sync";
import path from "path";

import { CreateCardsheetParams } from "../../../ttpg-darrell/src/lib-ext/create-assets/create-cardsheets/create-cardsheet-params";

export class AbstractCopyCards {
  private readonly _cardType: string;

  constructor(cardType: string) {
    this._cardType = cardType;
  }

  getCardJsonRoot(): string {
    const suffix: string =
      "TI4-TTPG/prebuild/Textures/en/card/" + this._cardType;
    let root: string = "/Users/darrell/ttpg/" + suffix;
    if (!fs.existsSync(root)) {
      root = "/Users/darrell/TI4-Online/" + suffix;
    }
    if (!fs.existsSync(root)) {
      throw new Error("Root directory not found");
    }
    return root;
  }

  getCardJsonFiles(): Array<string> {
    const root: string = this.getCardJsonRoot();
    const entries: readonly klawSync.Item[] = klawSync(root, {
      nodir: true,
      filter: (item) => {
        return item.path.endsWith(".json");
      },
    });
    return entries.map((item) => item.path);
  }

  getCardPlan(): Array<{
    src: string;
    dst: string;
    name: string;
    nsid: string;
  }> {
    const result: Array<{
      src: string;
      dst: string;
      name: string;
      nsid: string;
    }> = [];

    const cardJsonFiles: Array<string> = this.getCardJsonFiles();
    for (const cardJsonFile of cardJsonFiles) {
      const data: string = fs.readFileSync(cardJsonFile, "utf8");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cardJson: any = JSON.parse(data);

      const cardName: string = cardJson.name;
      const oldNsid: string = cardJson.id;
      //const cardDesc: string = cardJson.desc;

      const newNsid: string = oldNsid.replace(/_/g, "-");
      const oldFilename: string = path.basename(cardJsonFile);
      const newFilename: string = oldFilename.replace(/_/g, "-");

      result.push({
        src: cardJsonFile,
        dst: `prebuild/card/${this._cardType}/${newFilename}`,
        name: cardName,
        nsid: newNsid,
      });
    }
    return result;
  }

  getCreateCardsheetParams(): CreateCardsheetParams {
    const plan = this.getCardPlan();

    return {
      assetFilename: `card/${this._cardType}`,
      templateName: this._cardType,
      applyAllTags: [`card-${this._cardType}`],
      cardSizePixel: { width: 340, height: 510 },
      cardSizeWorld: { width: 4.2, height: 6.3 },

      back: `card/shared-back/${this._cardType}.jpg`,
      cards: plan.map((item) => {
        return {
          face: item.dst,
          name: item.name,
          metadata: item.nsid,
        };
      }),
    };
  }
}
