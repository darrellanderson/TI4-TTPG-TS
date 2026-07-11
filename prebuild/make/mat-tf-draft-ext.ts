import {
  ZCanvasCell,
  ZColCell,
  ZImageCell,
  ZPaddedCell,
  ZRowCell,
  ZTextCell,
} from "ttpg-darrell/build/cjs/lib-ext/image/cell/cell-parser";
import { CreateBoardParams } from "ttpg-darrell/build/cjs/lib-ext/create-assets/create-board/create-board-params";
import { CreateBoard } from "ttpg-darrell/build/cjs/lib-ext/create-assets/create-board/create-board";

const REF_W_WORLD: number = 8.8;
const REF_H_WORLD: number = 6.3;

const REF_W: number = Math.round(REF_W_WORLD * (308 / 6.3));
const REF_H: number = Math.round(REF_H_WORLD * (308 / 6.3));

const SPACING: number = Math.round((0.5 * REF_H) / REF_H_WORLD);

function getSlot(extraTag: string): ZCanvasCell {
  const slotCell: ZImageCell = {
    type: "ImageCell",
    width: 308,
    height: 220,
    imageFile: "prebuild/mat/slot/slot-landscape.jpg",
    snapPoints: [{ tags: ["card-faction-reference", extraTag] }],
  };
  return {
    type: "CanvasCell",
    width: REF_W,
    height: REF_H,
    children: [
      {
        left: (REF_W - 308) / 2,
        top: (REF_H - 220) / 2,
        child: slotCell,
      },
    ],
  };
}

function getLabel(
  labelText: string,
  width: number = REF_W,
  font: string = "Handel Gothic",
): ZTextCell {
  return {
    type: "TextCell",
    width: width,
    height: 24,
    text: font ? labelText.toUpperCase() : labelText,
    textColor: "#ffffff",
    fontSize: 24,
    font: font, // font installed on system
  };
}

function getSlotAndLabel(labelText: string, extraTag: string): ZColCell {
  return {
    type: "ColCell",
    spacing: SPACING,
    children: [getSlot(extraTag), getLabel(labelText)],
  };
}

function getTitle(): ZColCell {
  const width: number = REF_W * 3 + SPACING * 2;
  return {
    type: "ColCell",
    spacing: SPACING,
    children: [
      getLabel("Twilight's Fall Milty Draft Extension", width),
      getLabel(
        [
          "Fill slots with Faction Reference cards.",
          "Fill Priority BEFORE STARTING draft.",
          "Fill Home and Units BEFORE FINISHING draft.",
        ].join("   "),
        width,
        "",
      ),
    ],
  };
}

function getBody(): ZRowCell {
  return {
    type: "RowCell",
    spacing: SPACING,
    children: [
      getSlotAndLabel("Draft Priority", "tf-draft-priority"),
      getSlotAndLabel("Home System", "tf-draft-home"),
      getSlotAndLabel("Starting Units", "tf-draft-starting-units"),
    ],
  };
}

function getGrid(): ZColCell {
  return {
    type: "ColCell",
    spacing: SPACING,
    children: [getTitle(), getBody()],
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
  templateName: "TF Draft Ext",
  assetFilename: "mat/tf-draft-ext",
  templateMetadata: "mat:twilights-fall/tf-draft-ext",
  srcImage: getMat(),
  topDownWorldSize: {
    autoWidthHeight: { pixel: REF_H, world: REF_H_WORLD },
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
