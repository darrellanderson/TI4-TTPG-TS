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
  private readonly _srcRoot: string;
  private readonly _dstRoot: string;
  private _filter: (srcFilename: string) => boolean;

  constructor(cardType: string) {
    this._cardType = cardType;

    let root: string = "/Users/darrell/ttpg/TI4-TTPG";
    if (!fs.existsSync(root)) {
      root = "/Users/darrell/TI4-Online/TI4-TTPG";
    }
    if (!fs.existsSync(root)) {
      throw new Error("Root directory not found");
    }
    this._srcRoot = path.join(
      root,
      "prebuild/Textures/en/card",
      this._cardType
    );
    this._dstRoot = path.join(
      "prebuild/card",
      this._cardType.replace(/_/g, "-")
    );

    this._filter = () => true;
  }

  setFilter(filter: (srcFilename: string) => boolean): this {
    this._filter = filter;
    return this;
  }

  getCardJsonFiles(): Array<string> {
    const root: string = this._srcRoot;
    const entries: readonly klawSync.Item[] = klawSync(root, {
      nodir: true,
      traverseAll: true,
      filter: (item) => {
        return item.path.endsWith(".json");
      },
    });
    let result: Array<string> = entries.map((item) => item.path);
    result = result.filter((x) => this._filter(x));
    return result;
  }

  getCardPlans(): Array<CardPlan> {
    const result: Array<CardPlan> = [];

    const cardJsonFiles: Array<string> = this.getCardJsonFiles();
    for (const cardJsonFile of cardJsonFiles) {
      const data: string = fs.readFileSync(cardJsonFile, "utf8");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cardJson: any = JSON.parse(data);

      const src: string = cardJsonFile.replace(".json", ".jpg");
      let dst: string = path.join(
        this._dstRoot,
        path.basename(src).replace(/_/g, "-")
      );
      const name: string = cardJson.name;
      let nsid: string = cardJson.id.replace(/_/g, "-");
      const desc: string = cardJson.desc;

      // Remove faction from nsid type.
      const parts: Array<string> = nsid.split(":");

      if (parts[0]?.startsWith("card.technology.red")) {
        parts[0] = "card.technology.red";
      }
      if (parts[0]?.startsWith("card.technology.green")) {
        parts[0] = "card.technology.green";
      }
      if (parts[0]?.startsWith("card.technology.yellow")) {
        parts[0] = "card.technology.yellow";
      }
      if (parts[0]?.startsWith("card.technology.blue")) {
        parts[0] = "card.technology.blue";
      }
      if (parts[0]?.startsWith("card.technology.unit-upgrade")) {
        parts[0] = "card.technology.unit-upgrade";
      }
      if (parts[0]?.startsWith("card.technology.unknown")) {
        parts[0] = "card.technology.none";
      }
      if (parts[0]?.startsWith("card.leader.agent")) {
        parts[0] = "card.leader.agent";
      }
      if (parts[0]?.startsWith("card.leader.commander")) {
        parts[0] = "card.leader.commander";
      }
      if (parts[0]?.startsWith("card.leader.hero")) {
        parts[0] = "card.leader.hero";
      }
      if (parts[0]?.startsWith("card.leader.mech")) {
        parts[0] = "card.leader.mech";
      }
      if (parts[0]?.startsWith("card.leader.mech")) {
        parts[0] = "card.leader.mech";
      }
      if (parts[0]?.startsWith("card.promissory")) {
        parts[0] = "card.promissory";
      }
      if (parts[1]?.startsWith("base.only")) {
        const sourceParts = parts[1].split("/");
        parts[1] = "base/" + sourceParts[1];
      }
      nsid = parts.join(":");

      if (nsid === "card.technology.unit-upgrade:base/war-sun") {
        nsid = "card.technology.unit-upgrade:base/war-sun-2";
      }

      if (nsid.includes(":homebrew") || nsid.includes(":franken.homebrew")) {
        // Remove homebrew.
        const dstBase: string = dst.replace(".jpg", "");
        const candidates: Array<string> = [
          dstBase + ".jpg",
          dstBase + ".face.jpg",
          dstBase + ".back.jpg",
          dstBase + ".json",
        ];
        for (const candidate of candidates) {
          if (fs.existsSync(candidate)) {
            fs.unlinkSync(candidate);
          }
        }
        continue;
      }

      dst = dst.replace("eres-siphons", "e-res-siphon");
      dst = dst.replace("heltitan", "hel-titan");
      dst = dst.replace("prefab-arcologies", "pre-fab-arcologies");
      dst = dst.replace("superdreadnought", "super-dreadnought");
      dst = dst.replace("technology/unknown", "technology/none");

      nsid = nsid.replace("eres-siphons", "e-res-siphons");
      nsid = nsid.replace("heltitan", "hel-titan");
      nsid = nsid.replace("prefab-arcologies", "pre-fab-arcologies");
      nsid = nsid.replace("superdreadnought", "super-dreadnought");

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
      // Directory.
      const dir: string = path.dirname(plan.dst);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Copy card image file (keep same size).
      if (fs.existsSync(plan.src)) {
        fs.copyFileSync(plan.src, plan.dst);
        console.log("wrote", plan.dst);
      } else {
        const srcFace: string = plan.src.replace(".jpg", ".face.jpg");
        const srcBack: string = plan.src.replace(".jpg", ".back.jpg");
        const dstFace: string = plan.dst.replace(".jpg", ".face.jpg");
        const dstBack: string = plan.dst.replace(".jpg", ".back.jpg");
        fs.copyFileSync(srcFace, dstFace);
        fs.copyFileSync(srcBack, dstBack);
        console.log("wrote", dstFace, dstBack);
      }

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

      console.log("wrote", jsonFilename);
    }
  }
}
