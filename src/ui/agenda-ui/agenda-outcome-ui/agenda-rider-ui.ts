import {
  Button,
  Card,
  Color,
  GameObject,
  HorizontalAlignment,
  HorizontalBox,
  LayoutBox,
  Panel,
  Widget,
  world,
} from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../../abstract-ui/abtract-ui";
import { CONFIG } from "../../config/config";
import {
  AgendaRiderSchemaType,
  AgendaState,
} from "../../../lib/agenda-lib/agenda-state/agenda-state";
import { CreateZoomedUiType, ZoomableUI } from "../../zoomable-ui/zoomable-ui";
import { CreateZoomedCardUI } from "../../zoomable-ui/create-zoomed-card-ui";

export class AgendaRiderUI extends AbstractUI {
  static _createRiderButton(
    rider: AgendaRiderSchemaType,
    scale: number
  ): Widget | undefined {
    const obj: GameObject | undefined = world.getObjectById(rider.objId);
    if (!obj) {
      return undefined;
    }
    let name: string = obj.getName();
    if (obj instanceof Card) {
      name = obj.getCardDetails().name;
    }
    const maxLength: number = 20;
    if (name.length > maxLength) {
      name = name.substring(0, maxLength - 3) + "...";
    }

    const playerSlot: number = TI4.playerSeats.getPlayerSlotBySeatIndexOrThrow(
      rider.seat
    );
    const playerColor: Color = world.getSlotColor(playerSlot);
    const button: Button = new Button()
      .setFontSize(CONFIG.FONT_SIZE * scale)
      .setTextColor(playerColor)
      .setText(name);

    if (obj instanceof Card) {
      const createZoomedUi: CreateZoomedUiType = new CreateZoomedCardUI(
        obj
      ).get();
      const onClicked = ZoomableUI._getOnZoomOpenHandler(createZoomedUi, scale);
      button.onClicked.add(onClicked);
    }

    return button;
  }

  constructor(agendaState: AgendaState, outcomeIndex: number, scale: number) {
    const size: UI_SIZE = {
      w: CONFIG.BUTTON_WIDTH * scale * 4 + CONFIG.SPACING * 3 * scale,
      h: CONFIG.BUTTON_HEIGHT * scale,
    };

    const panel: Panel = new HorizontalBox().setChildDistance(
      CONFIG.SPACING * scale
    );

    const box: Widget = new LayoutBox()
      .setOverrideWidth(size.w)
      .setOverrideHeight(size.h)
      .setHorizontalAlignment(HorizontalAlignment.Left)
      .setChild(panel);

    super(box, size);

    let oldKey: string = "";
    agendaState.onAgendaStateChanged.add(() => {
      const myRiders: Array<AgendaRiderSchemaType> = agendaState
        .getRiders()
        .filter((r) => r.outcome === outcomeIndex);

      const newKey: string = myRiders
        .map((r) => r.objId)
        .sort()
        .join("|");
      if (oldKey === newKey) {
        return;
      }
      oldKey = newKey;
      panel.removeAllChildren();

      for (const rider of agendaState.getRiders()) {
        const widget: Widget | undefined = AgendaRiderUI._createRiderButton(
          rider,
          scale
        );
        if (widget) {
          panel.addChild(widget);
        }
      }
    });
  }
}
