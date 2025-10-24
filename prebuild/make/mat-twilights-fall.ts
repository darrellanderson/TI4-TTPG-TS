/**
 * Twilight's Fall decks
 */

import {
  ZColCell,
  ZImageCell,
  ZPaddedCell,
  ZRowCell,
  ZTextCell,
} from "../../node_modules/ttpg-darrell/build/cjs/lib-ext/image/cell/cell-parser/cell-schema";
import { CreateBoardParams } from "../../node_modules/ttpg-darrell/build/cjs/lib-ext/create-assets/create-board/create-board-params";
import { CreateBoard } from "../../node_modules/ttpg-darrell/build/cjs/lib-ext/create-assets/create-board/create-board";

const PORTRAIT_W: number = 220;
const PORTRAIT_H: number = 308;

const H_WORLD: number = 6.3;
const SPACING: number = Math.round((0.5 * PORTRAIT_H) / H_WORLD);

const COLOR: string = "#171717";

// 1: -
// 2: genome
// 3: (action)
// 4: -
// 5: -
// 6: unit upgrade
// 7: ability
// 8: paradigm

// ?: echo (faction unpack), edict (agenda), faction-tech (faction unpack)

function getSlotLandscape(tags: Array<string>): ZImageCell {
  const slotCell: ZImageCell = {
    type: "ImageCell",
    width: PORTRAIT_H,
    height: PORTRAIT_W,
    imageFile: "prebuild/mat/slot/slot-landscape.jpg",
    snapPoints: [{ tags }],
  };
  return slotCell;
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

function getLabelLandscape(labelText: string, tags: Array<string>): ZColCell {
  const slotCell: ZImageCell = getSlotLandscape(tags);
  const labelCell: ZTextCell = getLabel(labelText);
  return {
    type: "ColCell",
    spacing: SPACING,
    children: [slotCell, labelCell],
  };
}

function getGrid(): ZRowCell {
  return {
    type: "RowCell",
    spacing: SPACING,
    children: [
      getLabelLandscape("Genome", ["deck-tf-genome", "card-tf-genome"]),
      getLabelLandscape("Unit Upgrade", [
        "deck-tf-unit-upgrade",
        "card-tf-unit-upgrade",
      ]),
      getLabelLandscape("Ability", ["deck-tf-ability", "card-tf-ability"]),
      getLabelLandscape("Paradigm", ["deck-tf-paradigm", "card-tf-paradigm"]),
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
  templateName: "Twilight's Fall Decks Mat",
  assetFilename: "mat/deck-twilights-fall",
  templateMetadata: "mat.deck:twilights-fall/twilights-fall",
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
