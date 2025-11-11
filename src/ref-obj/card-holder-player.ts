import {
  CardHolder,
  Color,
  ObjectType,
  Player,
  refHolder,
  Rotator,
  world,
} from "@tabletop-playground/api";
import { Broadcast, CardHolderPlayerName, NSID } from "ttpg-darrell";

const ROTATE_KEY_NAME: string = "__rotate__";

// Wait a frame to:
// (1) let creator finish setting up if a new object,
// (2) let player data become valid if (re)loading.
const myObj = refHolder; // ref* gets cleared end of frame
let cardHolderPlayerName: CardHolderPlayerName | undefined = undefined;

process.nextTick(() => {
  if (myObj.isValid()) {
    cardHolderPlayerName = new CardHolderPlayerName(
      myObj
    ).setFontSizeAndPosition(64);

    const doRotate: string = myObj.getSavedData(ROTATE_KEY_NAME);
    if (doRotate === "true") {
      cardHolderPlayerName.reverseUI();
    }
  }
});

TI4.events.onPlayerChangedColor.add((playerSlot: number) => {
  if (playerSlot === myObj.getOwningPlayerSlot()) {
    const color: Color | undefined =
      TI4.playerColor.getSlotWidgetColor(playerSlot);
    if (cardHolderPlayerName && color) {
      cardHolderPlayerName.setColor(color);
    }
  }
});

// Sigh, add support for rotating player area.
const ACTION_NAME: string = "*Rotate player area";

myObj.removeCustomAction(ACTION_NAME);
myObj.addCustomAction(ACTION_NAME);

const actionHandler = (
  clickedObj: CardHolder,
  player: Player,
  identifier: string
): void => {
  if (identifier !== ACTION_NAME) {
    return; // not ours
  }
  const clickedObjOwner: number = clickedObj.getOwningPlayerSlot();

  const playerName: string = TI4.playerName.getByPlayer(player);
  const targetName: string = TI4.playerName.getBySlot(clickedObjOwner);
  Broadcast.chatAll(`${playerName} rotating ${targetName}'s player area`);

  const rotateNsids: Set<string> = new Set([
    "mat.player:base/trove",
    "mat.player:base/build",
    "mat.player:base/planet",
    "mat.player:base/technology",
    "card-holder:base/player-hand",
    "sheet.faction:base/generic",
  ]);

  const flipNsids: Set<string> = new Set([
    "sheet:base/command",
    "sheet:pok/leader",
  ]);

  const skipContained: boolean = true;
  for (const obj of world.getAllObjects(skipContained)) {
    const nsid: string = NSID.get(obj);
    const owner: number = obj.getOwningPlayerSlot();
    if (owner !== clickedObjOwner) {
      continue;
    }

    if (rotateNsids.has(nsid)) {
      const rot: Rotator = obj.getRotation();
      rot.yaw = (rot.yaw + 180) % 360;
      const objType: ObjectType = obj.getObjectType();
      obj.setObjectType(ObjectType.Regular);
      obj.setRotation(rot);
      obj.setObjectType(objType);
    }

    if (flipNsids.has(nsid)) {
      const rot: Rotator = obj.getRotation();
      rot.pitch = (rot.pitch + 180) % 360;
      const objType: ObjectType = obj.getObjectType();
      obj.setObjectType(ObjectType.Regular);
      obj.setRotation(rot);
      obj.setObjectType(objType);
    }
  }

  // Reverse card holder UI.
  if (cardHolderPlayerName) {
    // Use scripted layer to reverse UI.
    cardHolderPlayerName.reverseUI();

    // Remember in case of script reload.
    myObj.setSavedData("true", ROTATE_KEY_NAME);
  }
};

myObj.onCustomAction.add(actionHandler);
