import {
  Card,
  Color,
  GameObject,
  GameWorld,
  globalEvents,
  Player,
  Vector,
  world,
} from "@tabletop-playground/api";
import {
  Broadcast,
  CardUtil,
  DiceGroup,
  DiceGroupParams,
  DiceResult,
  IGlobal,
  NSID,
} from "ttpg-darrell";
import { RightClickFracture } from "../fracture/right-click-fracture";
import { Faction } from "../../lib/faction-lib/faction/faction";
import { TechColorType } from "../../lib/tech-lib/schema/tech-schema";
import { System } from "../../lib/system-lib/system/system";
import { SpawnControlToken } from "../../lib/control-token-lib/spawn-control-token";

const ACTION_FETCH_CONTROL_TOKEN: string = "*Fetch Control Token";
const ACTION_FETCH: string = "*Fetch Planet Cards";
const ACTION_ROLL_FOR_FRACTURE: string = "*Roll for Fracture";
const ACTION_SHOW_TECH_SYSTEMS: string = "*Show matching tech skips";

export class RightClickThundersEdge implements IGlobal {
  private readonly _onObjectCreated = (obj: GameObject): void => {
    this._maybeAddContextMenu(obj);
  };

  private readonly _onCustomAction = (
    object: GameObject,
    player: Player,
    identifier: string,
  ): void => {
    if (identifier === ACTION_FETCH_CONTROL_TOKEN) {
      this._fetchControlToken(object, player);
    }
    if (identifier === ACTION_FETCH) {
      this._fetchPlanetCard(object, player);
    } else if (identifier === ACTION_ROLL_FOR_FRACTURE) {
      this._rollForFracture(object, player);
    } else if (identifier === ACTION_SHOW_TECH_SYSTEMS) {
      this._highlightTechSkipsMatchingBreakthrough(player);
    }
  };

  init(): void {
    globalEvents.onObjectCreated.add(this._onObjectCreated);
    const skipContained: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      this._maybeAddContextMenu(obj);
    }
  }

  _maybeAddContextMenu(obj: GameObject): void {
    const thundersEdgeNsid: string =
      "token.attachment.system:thunders-edge/thunders-edge";
    const nsid: string = NSID.get(obj);
    if (nsid === thundersEdgeNsid) {
      obj.removeCustomAction(ACTION_FETCH_CONTROL_TOKEN);
      obj.addCustomAction(ACTION_FETCH_CONTROL_TOKEN);
      obj.removeCustomAction(ACTION_FETCH);
      obj.addCustomAction(ACTION_FETCH);
      obj.removeCustomAction(ACTION_ROLL_FOR_FRACTURE);
      obj.addCustomAction(ACTION_ROLL_FOR_FRACTURE);
      obj.removeCustomAction(ACTION_SHOW_TECH_SYSTEMS);
      obj.addCustomAction(ACTION_SHOW_TECH_SYSTEMS);
      obj.onCustomAction.remove(this._onCustomAction);
      obj.onCustomAction.add(this._onCustomAction);
    }
  }

  _fetchControlToken(obj: GameObject, player: Player): void {
    const pos: Vector = obj.getPosition().add([0, 0, 10]);
    const controlToken: GameObject | undefined =
      new SpawnControlToken().spawnControlToken(player.getSlot());
    if (controlToken) {
      controlToken.setPosition(pos);
      controlToken.snapToGround();
    } else {
      const playerName: string = TI4.playerName.getByPlayer(player);
      const color: Color = world.getSlotColor(player.getSlot());
      const msg: string = `Thunder's Edge: right click ${playerName} could not fetch control token`;
      Broadcast.chatAll(msg, color);
    }
  }

  _fetchPlanetCard(obj: GameObject, _player: Player): void {
    const cardUtil: CardUtil = new CardUtil();
    const pos = obj.getPosition().add([0, 0, 10]);

    const nsids: Array<string> = [
      "card.planet:thunders-edge/thunders-edge",
      "card.legendary-planet:thunders-edge/jupiter-brain",
    ];

    nsids.forEach((nsid) => {
      const card: Card | undefined = cardUtil.fetchCard(nsid);
      if (card) {
        card.setPosition(pos);
        card.snapToGround();
      }
    });
  }

  /**
   * On a 1 or 10 fracture enters play.
   *
   * @param obj
   * @param _player
   */
  _rollForFracture(obj: GameObject, player: Player): void {
    const callback = (
      diceResults: Array<DiceResult>,
      _player: Player,
    ): void => {
      const result: DiceResult | undefined = diceResults[0];
      if (result === undefined) {
        throw new Error("Expected a result");
      }

      const value: number = result.value;
      const doDeploy: boolean = value === 1 || value === 10;
      const action: string = doDeploy ? "enters play" : "does not enter play";

      const playerName: string = TI4.playerName.getByPlayer(player);
      const color: Color = world.getSlotColor(player.getSlot());
      const msg: string = `${playerName} rolled ${value} for fracture, ${action}`;
      Broadcast.chatAll(msg, color);

      if (doDeploy) {
        this._deployFracture();
      }
    };

    const diceGroupParams: DiceGroupParams = {
      diceParams: [
        {
          sides: 10,
          id: "fracture-roll",
        },
      ],
      player,
      callback,
      position: obj.getPosition().add([0, 0, 3]),
      doFakeRoll: GameWorld.getExecutionReason() === "unittest",
    };
    DiceGroup.roll(diceGroupParams);
  }

  _deployFracture(): void {
    // Leverage existing deploy (note does NOT call init to prevent new listeners).
    new RightClickFracture()._deployFracture();
  }

  _highlightTechSkipsMatchingBreakthrough(player: Player): void {
    const playerSlot: number = player.getSlot();
    const playerName: string = TI4.playerName.getBySlot(playerSlot);
    const color: Color = world.getSlotColor(playerSlot);

    const faction: Faction | undefined =
      TI4.factionRegistry.getByPlayerSlot(playerSlot);
    if (!faction) {
      const msg: string = `Highlighting systems with breakthrough techs: no faction for player slot ${playerSlot}`;
      Broadcast.chatAll(msg, color);
      return;
    }

    const breakthroughColors: Array<TechColorType> =
      faction.getBreakthroughTechEquivalences();
    const msg: string = `${playerName} highlighting systems with breakthrough techs: ${breakthroughColors.join(", ")}`;
    Broadcast.chatAll(msg, color);

    const skipContained: boolean = true;
    const positions: Array<Vector> = TI4.systemRegistry
      .getAllSystemsWithObjs(skipContained)
      .filter((system: System): boolean => {
        for (const planet of system.getPlanets()) {
          for (const techSkip of planet.getTechs()) {
            if (breakthroughColors.includes(techSkip as TechColorType)) {
              return true;
            }
          }
        }
        return false;
      })
      .map((system: System): Vector => system.getObj().getPosition());

    // Ping goes away pretty quickly, show it a few times.
    const playSound: boolean = false;
    for (let delay = 0; delay < 10; delay += 2.5) {
      const delayMs: number = delay * 1000;
      setTimeout(() => {
        positions.forEach((pos: Vector): void => {
          world.showPing(pos, color, playSound);
        });
      }, delayMs);
    }
  }
}
