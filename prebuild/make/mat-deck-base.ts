import {
  ZBaseCell,
  ZImageCell,
  ZPaddedCell,
  ZRowCell,
} from "../../node_modules/ttpg-darrell/build/cjs/lib-ext/image/cell/cell-parser/cell-schema";
import { CreateBoardParams } from "../../node_modules/ttpg-darrell/build/cjs/lib-ext/create-assets/create-board/create-board-params";
import { CreateBoard } from "../../node_modules/ttpg-darrell/build/cjs/lib-ext/create-assets/create-board/create-board";

const W: number = 220;
const H: number = 308;
const SYMBOL_SIZE: number = 200;

const H_WORLD: number = 6.3;
const SPACING: number = Math.round((0.5 * H) / H_WORLD);

const COLOR: string = "#171717";

function getSymbolSlot(symbolFile: string, tags: Array<string>): ZBaseCell {
  const slot: ZImageCell = {
    type: "ImageCell",
    width: W,
    height: H,
    imageFile: `prebuild/mat/slot/slot-portrait.jpg`,
    snapPoints: [{ tags: tags }],
  };
  const symbol: ZImageCell = {
    type: "ImageCell",
    width: SYMBOL_SIZE,
    height: SYMBOL_SIZE,
    imageFile: symbolFile,
  };
  return {
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
}

function getEmptySlot(): ZBaseCell {
  return {
    type: "SolidCell",
    width: W,
    height: H,
    color: COLOR,
  };
}

function getLabel(labelText: string): ZBaseCell {
  return {
    type: "TextCell",
    width: W,
    height: 24,
    text: labelText.toUpperCase(),
    textColor: "#ffffff",
    fontSize: 24,
    font: "Handel Gothic", // font installed on system
  };
}

function deckAndDiscard(
  cardNsidName: string,
  labelText: string,
  symbolFile: string
): ZBaseCell {
  const deckSlot: ZBaseCell = getSymbolSlot(symbolFile, [
    `deck-${cardNsidName}`,
    `card-${cardNsidName}`,
  ]);
  const discardSlot: ZBaseCell = getSymbolSlot(symbolFile, [
    `discard-${cardNsidName}`,
    `card-${cardNsidName}`,
  ]);
  const labelCell: ZBaseCell = getLabel(labelText);
  return {
    type: "ColCell",
    spacing: SPACING,
    children: [deckSlot, discardSlot, labelCell],
  };
}

function deckNoDiscard(
  cardNsidName: string,
  labelText: string,
  symbolFile: string
): ZBaseCell {
  const deckSlot: ZBaseCell = getSymbolSlot(symbolFile, [
    `deck-${cardNsidName}`,
    `card-${cardNsidName}`,
  ]);
  const emptySlot: ZBaseCell = getEmptySlot();
  const labelCell: ZBaseCell = getLabel(labelText);
  return {
    type: "ColCell",
    spacing: SPACING,
    children: [deckSlot, emptySlot, labelCell],
  };
}

function deckGrid(): ZRowCell {
  return {
    type: "RowCell",
    spacing: SPACING,
    children: [
      deckNoDiscard(
        "objective-secret",
        "Secret",
        "prebuild/mat/slot/symbol-secret.png"
      ),
      deckAndDiscard("agenda", "Agenda", "prebuild/mat/slot/symbol-agenda.png"),
      deckAndDiscard("action", "Action", "prebuild/mat/slot/symbol-action.png"),
    ],
  };
}

function deckMat(): ZPaddedCell {
  return {
    type: "PaddedCell",
    padding: SPACING,
    child: deckGrid(),
    background: COLOR,
  };
}

const params: CreateBoardParams = {
  templateName: "Base Decks Mat",
  assetFilename: "mat/deck-base",
  templateMetadata: "mat.deck:base/base",
  srcImage: deckMat(),
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
