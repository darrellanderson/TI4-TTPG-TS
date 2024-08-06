/**
 * Combine base planet and pok legendary planet in one mat.
 */

import {
  CreateBoard,
  CreateBoardParams,
  ZCanvasCell,
  ZColCell,
  ZImageCell,
  ZPaddedCell,
  ZTextCell,
} from "../../../ttpg-darrell/src/index-ext";

const PORTRAIT_W: number = 220;
const PORTRAIT_H: number = 308;
const SYMBOL_SIZE: number = 200;

const H_WORLD: number = 6.3;
const SPACING: number = Math.round((0.5 * PORTRAIT_H) / H_WORLD);

const COLOR: string = "#171717";

function getSymbolSlotPortrait(
  symbolFile: string,
  tags: Array<string>
): ZCanvasCell {
  const slotCell: ZImageCell = {
    type: "ImageCell",
    width: PORTRAIT_W,
    height: PORTRAIT_H,
    imageFile: "prebuild/mat/slot/slot-portrait.jpg",
    snapPoints: [{ tags }],
  };
  const symbolCell: ZImageCell = {
    type: "ImageCell",
    width: SYMBOL_SIZE,
    height: SYMBOL_SIZE,
    imageFile: symbolFile,
  };
  return {
    type: "CanvasCell",
    width: PORTRAIT_H,
    height: PORTRAIT_H,
    children: [
      { left: (PORTRAIT_H - PORTRAIT_W) / 2, top: 0, child: slotCell },
      {
        left: (PORTRAIT_H - SYMBOL_SIZE) / 2,
        top: (PORTRAIT_H - SYMBOL_SIZE) / 2,
        child: symbolCell,
      },
    ],
  };
}

function getSymbolSlotLandscape(
  symbolFile: string,
  tags: Array<string>
): ZCanvasCell {
  const slotCell: ZImageCell = {
    type: "ImageCell",
    width: PORTRAIT_H,
    height: PORTRAIT_W,
    imageFile: "prebuild/mat/slot/slot-landscape.jpg",
    snapPoints: [{ tags }],
  };
  const symbolCell: ZImageCell = {
    type: "ImageCell",
    width: SYMBOL_SIZE,
    height: SYMBOL_SIZE,
    imageFile: symbolFile,
  };
  return {
    type: "CanvasCell",
    width: PORTRAIT_H,
    height: PORTRAIT_H,
    children: [
      { left: 0, top: (PORTRAIT_H - PORTRAIT_W) / 2, child: slotCell },
      {
        left: (PORTRAIT_H - SYMBOL_SIZE) / 2,
        top: (PORTRAIT_H - SYMBOL_SIZE) / 2,
        child: symbolCell,
      },
    ],
  };
}

function getLabel(labelText: string): ZTextCell {
  return {
    type: "TextCell",
    width: PORTRAIT_H,
    height: 24,
    text: labelText.toUpperCase(),
    textColor: "#ffffff",
    fontSize: 24,
    font: "Handel Gothic", // font installed on system
  };
}

function getGrid(): ZColCell {
  return {
    type: "ColCell",
    spacing: SPACING,
    children: [
      getSymbolSlotPortrait("prebuild/mat/slot/symbol-planet.png", [
        "deck-planet",
      ]),
      getSymbolSlotLandscape("prebuild/mat/slot/symbol-planet.png", [
        "deck-legendary-planet",
      ]),
      getLabel("Planet"),
    ],
  };
}

function getMat(): ZPaddedCell {
  return {
    type: "PaddedCell",
    padding: SPACING,
    child: getGrid(),
    background: COLOR,
  };
}

const params: CreateBoardParams = {
  templateName: "Planet Decks Mat",
  assetFilename: "mat/deck-planet",
  templateMetadata: "mat.deck:base/planet",
  srcImage: getMat(),
  topDownWorldSize: {
    autoWidthHeight: { pixel: PORTRAIT_H, world: H_WORLD },
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
