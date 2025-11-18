import {
  CardHolder,
  Color,
  GameObject,
  ObjectType,
  Player,
  refHolder,
  Rotator,
  Vector,
  world,
} from "@tabletop-playground/api";
import { Broadcast, CardHolderPlayerName, Find, NSID } from "ttpg-darrell";

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
    "mat:base/status-pad",
    "mat.player:base/trove",
    "mat.player:base/build",
    "mat.player:base/planet",
    "mat.player:base/technology",
    "card-holder:base/player-hand",
    //"sheet.faction:base/generic",
  ]);

  const flipAndSwapNsids: Set<string> = new Set([
    "sheet:base/command",
    "sheet:pok/leader",
  ]);

  // Find faction sheet.
  const skipContained: boolean = true;
  let factionSheet: GameObject | undefined = undefined;
  for (const obj of world.getAllObjects(skipContained)) {
    const nsid: string = NSID.get(obj);
    if (nsid.startsWith("sheet.faction:")) {
      const pos: Vector = obj.getPosition();
      const owner: number = new Find().closestOwnedCardHolderOwner(pos);
      if (owner === clickedObjOwner) {
        factionSheet = obj;
        break;
      }
    }
  }

  // Lift faction sheet (moving command/leader sheets below it can cause issues).
  if (factionSheet) {
    const above: Vector = factionSheet.getPosition().add([0, 0, 10]);
    factionSheet.setObjectType(ObjectType.Regular);
    factionSheet.setPosition(above);

    const rot: Rotator = factionSheet.getRotation();
    rot.yaw = (rot.yaw + 180) % 360;
    factionSheet.setRotation(rot);
  }

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

    if (factionSheet && flipAndSwapNsids.has(nsid)) {
      const pos: Vector = obj.getPosition();
      const rot: Rotator = obj.getRotation();

      const centerY: number = factionSheet.getPosition().y;
      const dy: number = centerY - pos.y;
      pos.y = centerY + dy;
      rot.yaw = (rot.yaw + 180) % 360;

      const objType: ObjectType = obj.getObjectType();
      obj.setObjectType(ObjectType.Regular);
      obj.setPosition(pos);
      obj.setRotation(rot);
      obj.setObjectType(objType);
    }
  }

  // Lower faction sheet.
  if (factionSheet) {
    factionSheet.snapToGround();
    factionSheet.setObjectType(ObjectType.Ground);
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
