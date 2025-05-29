import {
  CreateBoard,
  CreateBoardParams,
  ZCanvasCell,
  ZColCell,
  ZImageCell,
  ZPaddedCell,
  ZTextCell,
} from "../../../ttpg-darrell/src/index-ext";

const REF_W_WORLD: number = 12.9;
const REF_H_WORLD: number = 7.5;

const REF_W: number = Math.round(REF_W_WORLD * (308 / 6.3));
const REF_H: number = Math.round(REF_H_WORLD * (308 / 6.3));

const SPACING: number = Math.round((0.5 * REF_H) / REF_H_WORLD);

function getSlot(): ZCanvasCell {
  const slotCell: ZImageCell = {
    type: "ImageCell",
    width: 308,
    height: 220,
    imageFile: "prebuild/mat/slot/slot-landscape.jpg",
    snapPoints: [{ tags: ["card-event", "deck-event"] }],
  };
  return {
    type: "CanvasCell",
    width: REF_W,
    height: REF_H,
    children: [
      {
        left: Math.round((REF_W - 308) / 2),
        top: Math.round((REF_H - 220) / 2),
        child: slotCell,
      },
    ],
  };
}

function getLabel(labelText: string): ZTextCell {
  return {
    type: "TextCell",
    width: REF_W,
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
    children: [getSlot(), getLabel("Event")],
  };
}

function getMat(): ZPaddedCell {
  return {
    type: "PaddedCell",
    padding: SPACING,
    child: getGrid(),
    background: "#171717",
  };
}

const params: CreateBoardParams = {
  templateName: "Event Mat",
  assetFilename: "mat/deck-event",
  templateMetadata: "mat.deck:base/event",
  srcImage: getMat(),
  topDownWorldSize: {
    autoWidthHeight: { pixel: REF_H, world: REF_H_WORLD },
    depth: 0.25,
  },
  preshrink: 512,
};

async function go() {
  const createBoard = new CreateBoard(params);
  await createBoard.clean();
  await createBoard.writeFiles();
}
go();
