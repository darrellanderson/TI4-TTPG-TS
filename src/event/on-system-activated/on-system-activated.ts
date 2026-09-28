import {
  Color,
  GameObject,
  globalEvents,
  ImageWidget,
  Player,
  refPackageId,
  Rotator,
  UIElement,
  Vector,
  world,
} from "@tabletop-playground/api";
import { Broadcast, IGlobal, NSID } from "ttpg-darrell";

import { System } from "../../lib/system-lib/system/system";

const packageId: string = refPackageId;

// Persist the last activated system and the player slot that activated it.
const KEY: string = "@TI4/last-activated";
type LastActivatedType = {
  tile: number;
  objId: string;
  slot: number;
};

// Animation.
const PULSE_SECONDS: number = 3; // from 0->1->0
const DISPLAY_SECONDS_APPROX: number = 15; // 30 in TTS
const DISPLAY_SECONDS: number =
  Math.ceil(DISPLAY_SECONDS_APPROX / PULSE_SECONDS) * PULSE_SECONDS; // complete last pulse

export class OnSystemActivated implements IGlobal {
  // System activated animation.
  private _lastActivatedTimestamp: number = -1;
  private _image: ImageWidget | undefined = undefined;
  private _ui: UIElement | undefined = undefined;

  static getLastActivatedSystem(): System | undefined {
    const state: LastActivatedType | undefined =
      this._loadLastActivatedSystem();
    if (state) {
      return TI4.systemRegistry.getBySystemTileNumber(state.tile, state.objId);
    }
    return undefined;
  }

  static getLastActivatingPlayerSlot(): number | undefined {
    const state: LastActivatedType | undefined =
      this._loadLastActivatedSystem();
    if (state) {
      return state.slot;
    }
    return undefined;
  }

  static _saveLastActivatedSystem(system: System, player: Player): void {
    const state: LastActivatedType = {
      tile: system.getSystemTileNumber(),
      objId: system.getObj().getId(),
      slot: player.getSlot(),
    };
    const json: string = JSON.stringify(state);
    world.setSavedData(json, KEY);
  }

  static _loadLastActivatedSystem(): LastActivatedType | undefined {
    const json: string = world.getSavedData(KEY);
    if (json && json.length > 0) {
      const parsed = JSON.parse(json);
      const tile: number = parsed.tile;
      const objId: string = parsed.objId;
      const slot: number = parsed.slot;
      return { tile, objId, slot };
    }
    return undefined;
  }

  /**
   * Dropping a command token is ONE way to activate a system, not the only way.
   *
   * @param object
   * @param player
   * @param _thrown
   * @param _grabPosition
   * @param _grabRotation
   */
  private readonly _onReleasedHandler = (
    object: GameObject,
    player: Player,
    _thrown: boolean,
    _grabPosition: Vector | [x: number, y: number, z: number],
    _grabRotation: Rotator | [pitch: number, yaw: number, roll: number],
  ): void => {
    const playerSlot: number = TI4.turnOrder.getCurrentTurn();
    const isActivePlayer: boolean = playerSlot === player.getSlot();
    if (isActivePlayer) {
      const pos: Vector = object.getPosition();
      const system: System | undefined = TI4.systemRegistry.getByPosition(pos);
      if (system) {
        TI4.events.onSystemActivated.trigger(system, player);
      }
    }
  };

  readonly _onTickHandler = (): void => {
    const ageSeconds = (Date.now() - this._lastActivatedTimestamp) / 1000;
    if (ageSeconds > DISPLAY_SECONDS) {
      this._cancelAnimation();
      return;
    } else if (this._image) {
      const u: number = (ageSeconds % PULSE_SECONDS) / PULSE_SECONDS;
      const phi: number = u * Math.PI * 2;
      const color: Color = this._image.getTintColor();
      color.a = 1 - (Math.cos(phi) + 1) / 2;
      this._image.setTintColor(color);
    }
  };

  init(): void {
    globalEvents.onObjectCreated.add((obj: GameObject): void => {
      this._maybeLinkCommandToken(obj);
    });
    const skipContained: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      this._maybeLinkCommandToken(obj);
    }

    // Report system activation.
    TI4.events.onSystemActivated.add((system: System, player: Player): void => {
      OnSystemActivated._saveLastActivatedSystem(system, player); // do first for static tracking
      this._reportSystemActivation(system, player);
      this._displayActiveSystem(system, player);
    });
  }

  _maybeLinkCommandToken(obj: GameObject): void {
    const nsid: string = NSID.get(obj);
    if (nsid.startsWith("token.command:")) {
      obj.onReleased.remove(this._onReleasedHandler);
      obj.onReleased.add(this._onReleasedHandler);
    }
  }

  _reportSystemActivation(system: System, player: Player): void {
    const name: string = TI4.playerName.getByPlayer(player);
    const systemSummary: string = system.getName();
    const message: string = `${name} activated ${systemSummary}`;
    Broadcast.broadcastAll(message);
  }

  _displayActiveSystem(system: System, player: Player): void {
    const obj: GameObject = system.getObj();
    const pos: Vector = obj.getPosition();
    pos.z = world.getTableHeight() + 0.3;

    // Remove any existing animation.
    this._cancelAnimation();

    // Start the animation.
    const playerSlot: number = player.getSlot();
    const color: Color =
      TI4.playerColor.getSlotWidgetColor(playerSlot) ?? new Color(0, 0, 0, 1);
    const scale: number = 4;

    this._lastActivatedTimestamp = Date.now();

    this._image = new ImageWidget()
      .setImage("ui/hex-highlight.png", packageId)
      .setImageSize(165 * scale, 0)
      .setTintColor(color);

    this._ui = new UIElement();
    this._ui.position = pos;
    this._ui.scale = 1 / scale;
    this._ui.useTransparency = true;
    this._ui.useWidgetSize = true;
    this._ui.widget = this._image;

    world.addUI(this._ui);
    globalEvents.onTick.remove(this._onTickHandler);
    globalEvents.onTick.add(this._onTickHandler);
  }

  _cancelAnimation(): void {
    globalEvents.onTick.remove(this._onTickHandler);
    if (this._ui) {
      world.removeUIElement(this._ui);
      this._ui = undefined;
    }
    if (this._image) {
      this._image = undefined;
    }
    this._lastActivatedTimestamp = -1;
  }
}
