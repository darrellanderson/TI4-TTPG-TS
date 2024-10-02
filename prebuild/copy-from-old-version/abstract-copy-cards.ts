import fs from "fs";
import klawSync from "klaw-sync";
import path from "path";

type CardPlan = {
  src: string; // absolute path
  dst: string; // relative path
  name: string; // card name (not filename)
  nsid: string;
  desc: string;
};

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

  getCardPlans(): Array<CardPlan> {
    const result: Array<CardPlan> = [];

    const cardJsonFiles: Array<string> = this.getCardJsonFiles();
    for (const cardJsonFile of cardJsonFiles) {
      const data: string = fs.readFileSync(cardJsonFile, "utf8");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cardJson: any = JSON.parse(data);

      const src: string = cardJsonFile.replace(".json", ".jpg");
      const dst: string = `prebuild/card/${this._cardType}/${path.basename(src).replace(/_/g, "-")}`;
      const name: string = cardJson.name;
      const nsid: string = cardJson.id.replace(/_/g, "-");
      const desc: string = cardJson.desc;

      const plan: CardPlan = {
        src,
        dst,
        name,
        nsid,
        desc,
      };
      result.push(plan);
    }
    return result;
  }

  /*
  getCreateCardsheetParamsArray(): Array<CreateCardsheetParams> {
    const plans: Array<CardPlan> = this.getCardPlan();
    const sourceToPlans: Map<string, Array<CardPlan>> = new Map();

    for (const plan of plans) {
      const nsid: string = plan.nsid;
      const parsed: ParsedNSID | undefined = NSID.parse(nsid);
      if (parsed === undefined) {
        throw new Error(`Invalid NSID: ${nsid}`);
      }
      const source: string = parsed.sourceParts.join("-");
      let plans: Array<CardPlan> | undefined = sourceToPlans.get(source);
      if (plans === undefined) {
        plans = [];
        sourceToPlans.set(source, plans);
      }
      plans.push(plan);
    }

    return {
      assetFilename: `card/${this._cardType}`,
      templateName: this._cardType,
      applyAllTags: [`card-${this._cardType}`],
      cardSizePixel: { width: 340, height: 510 },
      cardSizeWorld: { width: 4.2, height: 6.3 },

      back: `prebuild/card/shared-back/${this._cardType}.jpg`,
      cards: plan.map((item) => {
        fs.copyFileSync(item.src, item.dst);
        return {
          face: item.dst,
          name: item.name,
          metadata: item.nsid,
        };
      }),
    };
  }
*/

  go(): void {
    const plans: Array<CardPlan> = this.getCardPlans();
    for (const plan of plans) {
      // Copy card image file (keep same size).
      fs.copyFileSync(plan.src, plan.dst);

      // Write the metadata file.
      const jsonFilename: string = plan.dst.replace(".jpg", ".json");
      const buffer: Buffer = Buffer.from(
        JSON.stringify(
          {
            name: plan.name,
            nsid: plan.nsid,
            desc: plan.desc,
          },
          null,
          2
        )
      );
      fs.writeFileSync(jsonFilename, buffer);
    }
  }
}
