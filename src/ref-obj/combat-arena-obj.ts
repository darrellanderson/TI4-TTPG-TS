import {
  GameObject,
  GameWorld,
  ImageWidget,
  Player,
  refObject,
  UIElement,
  Vector,
  world,
} from "@tabletop-playground/api";
import { Broadcast, HexType } from "ttpg-darrell";

import { OnSystemActivated } from "../event/on-system-activated/on-system-activated";
import { System } from "../lib/system-lib/system/system";
import { UnitPlastic } from "../lib/unit-lib/unit-plastic/unit-plastic";

const ACTION_WARP_IN: string = "*Warp In";
const ACTION_WARP_OUT: string = "*Warp Out";

export class CombatArenaObj {
  private readonly _obj: GameObject;
  private readonly _img: ImageWidget;

  private readonly _onSystemActivatedHandler = (
    system: System,
    _player: Player
  ): void => {
    this._setSystemImage(system.getSystemTileNumber());
  };

  constructor(obj: GameObject) {
    this._obj = obj;

    this._img = new ImageWidget();
    this._addUI();

    TI4.events.onSystemActivated.add(this._onSystemActivatedHandler);
    this._obj.onDestroyed.add(() => {
      TI4.events.onSystemActivated.remove(this._onSystemActivatedHandler);
    });

    this._setSystemImage(18);

    this._obj.addCustomAction(ACTION_WARP_IN);
    this._obj.addCustomAction(ACTION_WARP_OUT);
    this._obj.onCustomAction.add(
      (_obj: GameObject, _player: Player, actionName: string) => {
        switch (actionName) {
          case ACTION_WARP_IN:
            this.warpIn();
            break;
          case ACTION_WARP_OUT:
            this.warpOut();
            break;
        }
      }
    );
  }

  _addUI(): void {
    const extent: Vector = this._obj.getExtent(false, false);

    // Inset slightly, will have a white border.
    const d: number = Math.max(extent.x, extent.y);
    this._img.setImageSize(d * 20, d * 20);

    const ui: UIElement = new UIElement();
    ui.position = new Vector(0, 0, extent.z + 0.02);
    ui.useWidgetSize = true;
    ui.widget = this._img;
    this._obj.addUI(ui);
  }

  _setSystemImage(systemTileNumber: number): void {
    const system: System | undefined =
      TI4.systemRegistry.getBySystemTileNumber(systemTileNumber);
    if (system) {
      const img: string = system.getImg();
      const packageId: string = system.getImgPackageId();
      this._img.setImage(img, packageId);
    }
  }

  _getPlasticsInSystemOrArena(): Array<UnitPlastic> {
    const system: System | undefined =
      OnSystemActivated.getLastActivatedSystem();
    if (system) {
      const pos: Vector = system.getObj().getPosition();
      const hex: HexType = TI4.hex.fromPosition(pos);
      const plastics: Array<UnitPlastic> = UnitPlastic.getAll().filter(
        (plastic) => plastic.getHex() === hex
      );
      // Sort bottom to top so stacks with plastic on top keep order.
      plastics.sort((a, b) => a.getPos().z - b.getPos().z);
      return plastics;
    }
    return [];
  }

  warpIn(): void {
    const system: System | undefined =
      OnSystemActivated.getLastActivatedSystem();
    if (system) {
      const z: number = world.getTableHeight() + 10;
      const systemTileObj: GameObject = system.getObj();
      const arenaExtent: Vector = this._obj.getExtent(false, false);
      const tileExtent: Vector = systemTileObj.getExtent(false, false);
      const plastics: Array<UnitPlastic> = this._getPlasticsInSystemOrArena();
      for (const plastic of plastics) {
        const localPos = systemTileObj.worldPositionToLocal(plastic.getPos());
        localPos.x *= arenaExtent.x / tileExtent.x;
        localPos.y *= arenaExtent.y / tileExtent.y;
        const dst: Vector = this._obj.localPositionToWorld(localPos);
        dst.z = z;
        plastic.getObj().setPosition(dst, 1);
        plastic.getObj().snapToGround();
      }
    } else {
      Broadcast.broadcastAll("Warp in: no active system", Broadcast.ERROR);
    }
  }

  warpOut(): void {
    const system: System | undefined =
      OnSystemActivated.getLastActivatedSystem();
    if (system) {
      const z: number = world.getTableHeight() + 10;
      const plastics: Array<UnitPlastic> = this._getPlasticsInSystemOrArena();
      for (const plastic of plastics) {
        const dst: Vector = plastic.getPos(); // already in system tile (even if obj is in arena)
        dst.z = z;
        plastic.getObj().setPosition(dst, 1);
        plastic.getObj().snapToGround();
      }
    } else {
      Broadcast.broadcastAll("Warp out: no active system", Broadcast.ERROR);
    }
  }
}

export function delayedCreateCombatArena(
  obj: GameObject,
  executionReason: string
): void {
  if (executionReason !== "unittest") {
    process.nextTick(() => {
      if (obj.isValid()) {
        new CombatArenaObj(obj);
      }
    });
  }
}
delayedCreateCombatArena(refObject, GameWorld.getExecutionReason());
