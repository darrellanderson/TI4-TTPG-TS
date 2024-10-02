import fs from "fs";
import klawSync from "klaw-sync";

import {
  CardsheetCardType,
  CreateCardsheet,
  CreateCardsheetParams,
} from "../../../../ttpg-darrell/src/index-ext";

export class CreateDeck {
  private readonly _cardType: string;
  private readonly _portrait: boolean = true;

  constructor(cardType: string) {
    this._cardType = cardType;
  }

  getCardJsonFiles(): Array<string> {
    return klawSync("prebuild/card/" + this._cardType, {
      nodir: true,
      traverseAll: true,
      filter: (item) => {
        return item.path.endsWith(".json");
      },
    }).map((item) => item.path);
  }

  getSourceToCards(
    jsonFiles: Array<string>
  ): Map<string, Array<CardsheetCardType>> {
    const result: Map<string, Array<CardsheetCardType>> = new Map<
      string,
      Array<CardsheetCardType>
    >();
    for (const jsonFile of jsonFiles) {
      const data: string = fs.readFileSync(jsonFile, "utf8");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cardJson: any = JSON.parse(data);

      const nsid: string = cardJson.nsid.replace(/_/g, "-");
      const parts: Array<string> = nsid.split(/[:/]/);
      let source: string | undefined = parts[1];
      if (!source) {
        throw new Error("missing source in nsid: " + nsid);
      }
      source = source.replace(/\./g, "-");
      let cards: Array<CardsheetCardType> | undefined = result.get(source);
      if (cards === undefined) {
        cards = [];
        result.set(source, cards);
      }

      // Get face (and if not a shared image, back).
      // Make a relative path starting with prebuild.
      let face: string = jsonFile.replace(".json", ".jpg");
      let back: string | undefined = undefined;
      if (!fs.existsSync(face)) {
        face = jsonFile.replace(".json", ".face.jpg");
        back = jsonFile.replace(".json", ".back.jpg");
      }
      const faceParts: Array<string> = face.split("/");
      while (faceParts[0] !== "prebuild") {
        faceParts.shift();
      }
      face = faceParts.join("/");
      if (back) {
        const backParts: Array<string> = back.split("/");
        while (backParts[0] !== "prebuild") {
          backParts.shift();
        }
        back = backParts.join("/");
      }

      let card: CardsheetCardType | undefined = undefined;
      if (back === undefined) {
        card = {
          metadata: nsid,
          name: cardJson.name,
          face,
        };
      } else {
        card = {
          metadata: nsid,
          name: cardJson.name,
          face,
          back,
        };
      }
      cards.push(card);
    }
    return result;
  }

  getParams(
    cardType: string,
    source: string,
    cards: Array<CardsheetCardType>
  ): CreateCardsheetParams {
    const first: CardsheetCardType | undefined = cards[0];
    if (!first) {
      throw new Error("no cards for source: " + source);
    }
    const hasBack: boolean = first.back === undefined;

    const wPx: number = this._portrait ? 340 : 510;
    const hPx: number = this._portrait ? 510 : 340;
    const wWorld: number = this._portrait ? 4.2 : 6.3;
    const hWorld: number = this._portrait ? 6.3 : 4.2;

    let result: CreateCardsheetParams | undefined = undefined;
    if (hasBack) {
      result = {
        assetFilename: `card/${cardType}/${source}`,
        templateName: source,
        applyAllTags: [`card-${this._cardType}`],
        cardSizePixel: { width: wPx, height: hPx },
        cardSizeWorld: { width: wWorld, height: hWorld },
        back: `prebuild/card/shared-back/${cardType}.jpg`,
        cards,
      };
    } else {
      result = {
        assetFilename: `card/${cardType}/${source}`,
        templateName: source,
        applyAllTags: [`card-${this._cardType}`],
        cardSizePixel: { width: wPx, height: hPx },
        cardSizeWorld: { width: wWorld, height: hWorld },
        cards,
      };
    }
    return result;
  }

  createDeck(params: CreateCardsheetParams): void {
    const create = new CreateCardsheet(params);
    create.clean().then(() => {
      create.writeFiles();
    });
  }

  go(): void {
    const jsonFiles: Array<string> = this.getCardJsonFiles();
    const sourceToCards: Map<
      string,
      Array<CardsheetCardType>
    > = this.getSourceToCards(jsonFiles);
    for (const [source, cards] of sourceToCards) {
      const params: CreateCardsheetParams = this.getParams(
        this._cardType,
        source,
        cards
      );
      this.createDeck(params);
    }
  }
}
