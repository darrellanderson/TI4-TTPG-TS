import {
  ZBaseCell,
  ZCanvasCell,
  ZColCell,
  ZImageCell,
  ZPaddedCell,
  ZRowCell,
  ZTextCell,
} from "../../node_modules/ttpg-darrell/build/cjs/lib-ext/image/cell/cell-parser";
import { CreateBoardParams } from "../../node_modules/ttpg-darrell/build/cjs/lib-ext/create-assets/create-board/create-board-params";
import { CreateBoard } from "../../node_modules/ttpg-darrell/build/cjs/lib-ext/create-assets/create-board/create-board";

const W: number = 220;
const H: number = 308;
const SYMBOL_SIZE: number = 200;

const H_WORLD: number = 6.3;
const SPACING: number = Math.round((0.5 * H) / H_WORLD);
const DECK_EXTRA_GAP: number = SPACING; // gap + spacing on both sides

function labeledCell(
  labelText: string,
  isDeck: boolean,
  snapEverything?: boolean
): ZColCell {
  const tags = [
    "card-objective-1",
    "card-objective-2",
    "card-objective-secret",
  ];
  if (isDeck) {
    tags.push("deck-objective-2");
  }
  if (snapEverything) {
    tags.push("snap-extra");
  }
  const slot: ZImageCell = {
    type: "ImageCell",
    width: W,
    height: H,
    imageFile: `prebuild/mat/slot/slot-portrait.jpg`,
    snapPoints: [{ tags }],
  };
  const symbol: ZImageCell = {
    type: "ImageCell",
    width: SYMBOL_SIZE,
    height: SYMBOL_SIZE,
    imageFile: snapEverything
      ? `prebuild/mat/slot/symbol-empty.png`
      : `prebuild/mat/slot/symbol-objective-2.png`,
  };
  const slotWithSymbol: ZCanvasCell = {
    type: "CanvasCell",
    width: W,
    height: H,
    children: [
      { left: 0, top: 0, child: slot },
      {
        left: (W - SYMBOL_SIZE) / 2,
        top: (H - SYMBOL_SIZE) / 2,
        child: symbol,
      },
    ],
  };
  const label: ZTextCell = {
    type: "TextCell",
    width: W,
    height: 24,
    text: labelText.toUpperCase(),
    textColor: "#ffffff",
    fontSize: 24,
    font: "Handel Gothic", // font installed on system
  };
  return {
    type: "ColCell",
    spacing: SPACING,
    children: [slotWithSymbol, label],
  };
}

function gapCell(): ZBaseCell {
  return {
    type: "SolidCell",
    width: DECK_EXTRA_GAP,
    height: H,
    color: "#171717",
  };
}

function objectiveRow(): ZRowCell {
  return {
    type: "RowCell",
    spacing: SPACING,
    children: [
      labeledCell("Stage II", true),
      gapCell(),
      labeledCell("V", false),
      labeledCell("VI", false),
      labeledCell("VII", false),
      labeledCell("VIII", false),
      labeledCell("IX", false),
      gapCell(),
      labeledCell("Extra", false, true),
    ],
  };
}

function objectiveMat(): ZPaddedCell {
  return {
    type: "PaddedCell",
    padding: SPACING,
    child: objectiveRow(),
    background: "#171717",
  };
}

const params: CreateBoardParams = {
  templateName: "Objective 2 Mat",
  assetFilename: "mat/objective-2",
  templateMetadata: "mat:base/objective-2",
  srcImage: objectiveMat(),
  topDownWorldSize: {
    autoWidthHeight: { pixel: H, world: H_WORLD },
    depth: 0.25,
  },
  preshrink: 1024,
};

async function go() {
  const createBoard = new CreateBoard(params);
  await createBoard.clean();
  await createBoard.writeFiles();
}
go();
