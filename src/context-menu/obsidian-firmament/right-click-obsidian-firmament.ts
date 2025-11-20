import {
  Card,
  Color,
  GameObject,
  globalEvents,
  ObjectType,
  Player,
  Rotator,
  Vector,
  world,
} from "@tabletop-playground/api";
import {
  Broadcast,
  CardUtil,
  DeletedItemsContainer,
  Facing,
  Find,
  IGlobal,
  NSID,
} from "ttpg-darrell";

const ACTION_NAME: string = "*Swap Obsidian/Firmament";

const FACTION_SHEET_FIRMAMENT: string = "sheet.faction:thunders-edge/firmament";
const FACTION_SHEET_OBSIDIAN: string = "sheet.faction:thunders-edge/obsidian";

const SWAP_FIRMAMENT: Array<string> = [
  FACTION_SHEET_FIRMAMENT,
  "card.leader.agent:thunders-edge/myru-vos",
  "card.leader.commander:thunders-edge/captain-aroz",
  "card.leader.hero:thunders-edge/the-blade-beckons",
  "card.promissory:thunders-edge/black-ops",
  "card.alliance:thunders-edge/firmament",
  "card.planet:thunders-edge/cronos",
  "card.planet:thunders-edge/tallin",
];

const SWAP_OBSIDIAN: Array<string> = [
  FACTION_SHEET_OBSIDIAN,
  "card.leader.agent:thunders-edge/vos-hollow",
  "card.leader.commander:thunders-edge/aroz-hollow",
  "card.leader.hero:thunders-edge/the-blade-revealed",
  "card.promissory:thunders-edge/malevolency",
  "card.alliance:thunders-edge/obsidian",
  "card.planet:thunders-edge/cronos-hollow",
  "card.planet:thunders-edge/tallin-hollow",
];

const FLIP: Array<string> = [
  "card.leader.mech:thunders-edge/viper-ex-23",
  "card.technology.green:thunders-edge/neural-parasite",
  "card.technology.yellow:thunders-edge/planesplitter",
  "tile.system:thunders-edge/96",
];

export class RightClickObsidianFirmament implements IGlobal {
  readonly _onCustomAction = (
    obj: GameObject,
    player: Player,
    identifier: string
  ): void => {
    if (identifier === ACTION_NAME) {
      const playerName: string = TI4.playerName.getByPlayer(player);
      const msg: string = `${playerName} swapped Obsidian/Firmament`;
      const color: Color = world.getSlotColor(player.getSlot());
      Broadcast.chatAll(msg, color);

      const pos: Vector = obj.getPosition();
      const factionSheetNsid: string = NSID.get(obj);
      const fromFirmament: boolean =
        factionSheetNsid === FACTION_SHEET_FIRMAMENT;

      const playerSlot: number = new Find().closestOwnedCardHolderOwner(pos);

      if (fromFirmament) {
        this._remove(SWAP_FIRMAMENT);
        this._add(SWAP_OBSIDIAN, pos, playerSlot);
      } else {
        this._remove(SWAP_OBSIDIAN);
        this._add(SWAP_FIRMAMENT, pos, playerSlot);
      }
      this._flipAll(fromFirmament);
    }
  };

  readonly _onObjectCreated = (obj: GameObject): void => {
    const nsid: string = NSID.get(obj);
    if (nsid === FACTION_SHEET_OBSIDIAN || nsid === FACTION_SHEET_FIRMAMENT) {
      obj.removeCustomAction(ACTION_NAME);
      obj.addCustomAction(ACTION_NAME);
      obj.onCustomAction.remove(this._onCustomAction);
      obj.onCustomAction.add(this._onCustomAction);
    }
  };

  init(): void {
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      this._onObjectCreated(obj);
    }
    globalEvents.onObjectCreated.add(this._onObjectCreated);
  }

  _remove(nsids: Array<string>): void {
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (nsids.includes(nsid)) {
        if (obj instanceof Card && obj.getHolder()) {
          obj.removeFromHolder();
        }
        DeletedItemsContainer.destroyWithoutCopying(obj);
      }
    }
  }

  _add(
    nsids: Array<string>,
    factionSheetPos: Vector,
    playerSlot: number
  ): void {
    const deckLeaders: Card =
      TI4.spawn.spawnMergeDecksWithNsidPrefixOrThrow("card.leader");
    const deckPlanets: Card =
      TI4.spawn.spawnMergeDecksWithNsidPrefixOrThrow("card.planet");
    const deckPromissory: Card =
      TI4.spawn.spawnMergeDecksWithNsidPrefixOrThrow("card.promissory");
    const deckAlliance: Card =
      TI4.spawn.spawnMergeDecksWithNsidPrefixOrThrow("card.alliance");
    const leaderSheet: GameObject = this._findLeaderSheetOrThrow(playerSlot);
    const cardUtil: CardUtil = new CardUtil();

    for (const nsid of nsids) {
      let obj: GameObject | undefined;
      let pos: Vector | undefined;

      if (nsid === FACTION_SHEET_FIRMAMENT || nsid === FACTION_SHEET_OBSIDIAN) {
        obj = TI4.spawn.spawnOrThrow(nsid);
        pos = factionSheetPos;
      } else if (nsid.startsWith("card.leader.agent")) {
        obj = cardUtil.filterCards(deckLeaders, (cardNsid: string): boolean => {
          return cardNsid === nsid;
        });
        pos = leaderSheet.getSnapPoint(3)?.getGlobalPosition();
      } else if (nsid.startsWith("card.leader.commander")) {
        obj = cardUtil.filterCards(deckLeaders, (cardNsid: string): boolean => {
          return cardNsid === nsid;
        });
        pos = leaderSheet.getSnapPoint(2)?.getGlobalPosition();
      } else if (nsid.startsWith("card.leader.hero")) {
        obj = cardUtil.filterCards(deckLeaders, (cardNsid: string): boolean => {
          return cardNsid === nsid;
        });
        pos = leaderSheet.getSnapPoint(1)?.getGlobalPosition();
      } else if (nsid.startsWith("card.promissory")) {
        obj = cardUtil.filterCards(
          deckPromissory,
          (cardNsid: string): boolean => {
            return cardNsid === nsid;
          }
        );
      } else if (nsid.startsWith("card.alliance")) {
        obj = cardUtil.filterCards(
          deckAlliance,
          (cardNsid: string): boolean => {
            return cardNsid === nsid;
          }
        );
      } else if (nsid.startsWith("card.planet")) {
        obj = cardUtil.filterCards(deckPlanets, (cardNsid: string): boolean => {
          return cardNsid === nsid;
        });
      } else {
        throw new Error(`Unhandled nsid ${nsid}`);
      }

      if (!obj) {
        throw new Error(`Could not find ${nsid}`);
      }
      if (pos) {
        obj.setPosition(pos);
        if (
          nsid === FACTION_SHEET_FIRMAMENT ||
          nsid === FACTION_SHEET_OBSIDIAN
        ) {
          obj.setOwningPlayerSlot(playerSlot);
          obj.setObjectType(ObjectType.Ground);
        }
      } else if (obj instanceof Card) {
        cardUtil.dealToHolder(obj, playerSlot);
      }
    }

    DeletedItemsContainer.destroyWithoutCopying(deckLeaders);
    DeletedItemsContainer.destroyWithoutCopying(deckPlanets);
    DeletedItemsContainer.destroyWithoutCopying(deckPromissory);
    DeletedItemsContainer.destroyWithoutCopying(deckAlliance);
  }

  _flipAll(fwd: boolean): void {
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (FLIP.includes(nsid)) {
        this._flipOne(obj, fwd);
      }
    }
  }

  _flipOne(obj: GameObject, fwd: boolean): void {
    if (Facing.isFaceUp(obj) === fwd) {
      const rot: Rotator = obj.getRotation();
      const objType: ObjectType = obj.getObjectType();
      obj.setObjectType(ObjectType.Regular);
      rot.roll += 180;
      obj.setRotation(rot);
      obj.setObjectType(objType);
    }
  }

  _findLeaderSheetOrThrow(playerSlot: number): GameObject {
    const nsid: string = "sheet:pok/leader";
    const skipContained: boolean = true;
    const leaderSheet: GameObject | undefined = new Find().findGameObject(
      nsid,
      playerSlot,
      skipContained
    );
    if (!leaderSheet) {
      throw new Error("Leader sheet not found");
    }
    return leaderSheet;
  }
}
