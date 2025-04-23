import { Border, ScreenUIElement, world } from "@tabletop-playground/api";
import { GameData } from "../../lib/game-data-lib/game-data/game-data";
import { AbstractUI } from "../abstract-ui/abtract-ui";
import { AllPlayersTechsUI } from "./all-players-techs-ui";

const gameData: GameData = {
  players: [
    {
      technologies: [
        "Advanced Carrier II",
        "Antimass Deflectors",
        "Assault Cannon",
      ],
    },
    {
      technologies: ["Bioplasmosis", "Graviton Laser System"],
    },
  ],
};

const scale: number = 1;
const abstractUi: AbstractUI = new AllPlayersTechsUI(scale, gameData);

const screenUI = new ScreenUIElement();
screenUI.positionX = 0.5;
screenUI.positionY = 0.5;
screenUI.relativePositionX = true;
screenUI.relativePositionY = true;

screenUI.width = abstractUi.getSize().w + 4; // border
screenUI.height = abstractUi.getSize().h + 4;
screenUI.relativeWidth = false;
screenUI.relativeHeight = false;

screenUI.anchorX = 0.5;
screenUI.anchorY = 0.5;

screenUI.widget = new Border().setChild(abstractUi.getWidget());

world.addScreenUI(screenUI);
