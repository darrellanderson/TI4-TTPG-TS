import {
  Button,
  Card,
  CardHolder,
  Color,
  HorizontalAlignment,
  Player,
  world,
} from "@tabletop-playground/api";
import {
  Broadcast,
  CardUtil,
  PlayerSlot,
  ThrottleClickHandler,
} from "ttpg-darrell";

import { Faction } from "../../lib/faction-lib/faction/faction";
import { FindPlayerTechDeck } from "../../lib/tech-lib/find-player-tech-deck/find-player-tech-deck";
import { PlayerTechSummary } from "../../lib/tech-lib/player-tech-summary/player-tech-summary";
import { PlayerWithFactionTechs } from "../../lib/tech-lib/player-with-faction-techs/player-with-faction-techs";
import { TechColorType } from "../../lib/tech-lib/schema/tech-schema";
import { Tech } from "../../lib/tech-lib/tech/tech";

import { AbstractUI } from "../abstract-ui/abtract-ui";
import { CONFIG } from "../config/config";
import { HorizontalUIBuilder } from "../panel/horizontal-ui-builder";
import { SingleTechUI } from "./single-tech-ui";
import { VerticalUIBuilder } from "../panel/vertical-ui-builder";
import { TechCardMutableUI } from "./tech-card-mutable-ui";
import { DivUI } from "../div-ui/div-ui";
import { ButtonUI } from "../button-ui/button-ui";

export class ChooseTechnologyUI extends AbstractUI {
  private readonly _ui: AbstractUI;
  private readonly _currentChoiceUi: TechCardMutableUI;
  private _currentTechSelection: Tech | undefined;

  _setCurrentTechSelection(tech: Tech | undefined): void {
    this._currentTechSelection = tech;
  }

  readonly _onFetchTechClickHandler = new ThrottleClickHandler<Button>(
    (_button: Button, player: Player): void => {
      const playerSlot: number = player.getSlot();
      const cardHolder: CardHolder | undefined =
        TI4.playerSeats.getCardHolderByPlayerSlot(playerSlot);
      const techDeck: Card | undefined = new FindPlayerTechDeck().getTechDeck(
        playerSlot
      );

      if (cardHolder && techDeck && this._currentTechSelection) {
        // Look for the tech in the tech deck.
        const nsid: string = this._currentTechSelection.getNsid();
        const card: Card | undefined = new CardUtil().filterCards(
          techDeck,
          (candidateNsid: string): boolean => nsid === candidateNsid
        );
        if (card) {
          card.setRotation([0, 0, 180]);
          cardHolder.insert(card, 0);

          const playerName: string = TI4.playerName.getByPlayer(player);
          const techName: string = this._currentTechSelection.getName();
          const msg: string = `${playerName} selected ${techName}`;
          const color: Color = world.getSlotColor(playerSlot);
          Broadcast.chatAll(msg, color);
        }
      }
    }
  ).get();

  static _getTechColumn(
    scale: number,
    techColor: TechColorType,
    faction: Faction | undefined,
    playerTechSummary: PlayerTechSummary,
    onTechSelected: (tech: Tech) => void
  ): AbstractUI {
    const techs: Array<Tech> = new PlayerWithFactionTechs(faction)
      .get()
      .filter((tech: Tech): boolean => {
        return tech.getColor() === techColor;
      });
    Tech.sortByLevel(techs);

    if (faction) {
      const nsids: Array<string> = techs
        .filter((tech: Tech): boolean => {
          return tech.getColor() === "unit-upgrade";
        })
        .map((tech: Tech): string => {
          return tech.getNsid();
        });
      nsids.sort();
    }

    const uis: Array<AbstractUI> = techs.map((tech: Tech): AbstractUI => {
      const singleTechUi: SingleTechUI = new SingleTechUI(
        scale,
        tech,
        faction,
        playerTechSummary
      );
      const button: Button = singleTechUi.getButton();
      button.onClicked.add((_button: Button, _player: Player): void => {
        onTechSelected(tech);
      });
      return singleTechUi;
    });

    return new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs(uis)
      .build();
  }

  constructor(scale: number, playerSlot: PlayerSlot) {
    const faction: Faction | undefined =
      TI4.factionRegistry.getByPlayerSlot(playerSlot);
    const playerTechSummary: PlayerTechSummary = new PlayerTechSummary(
      playerSlot
    );

    const currentChoice: TechCardMutableUI = new TechCardMutableUI(scale);

    const selectTechButton: ButtonUI = new ButtonUI(scale);
    selectTechButton.getButton().setText("Draw tech to hand").setEnabled(false);

    const closeButton: ButtonUI = new ButtonUI(scale);
    closeButton.getButton().setText("Close");
    closeButton.getButton().onClicked.add(
      new ThrottleClickHandler<Button>(
        (_button: Button, _player: Player): void => {
          TI4.events.onTechChooserRequest.trigger(playerSlot);
        }
      ).get()
    );

    const leftPanel: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .setHorizontalAlignment(HorizontalAlignment.Center)
      .addUIs([currentChoice, selectTechButton, closeButton])
      .build();

    const onTechSelected = (tech: Tech): void => {
      this._currentTechSelection = tech;
      this._currentChoiceUi.setCardNsid(tech.getNsid());
      selectTechButton.getButton().setEnabled(true);
    };

    const scaledDivHeight: number = leftPanel.getSize().h;
    const uis: Array<AbstractUI> = [
      leftPanel,
      new DivUI(scale, scaledDivHeight, "vertical"),
      ChooseTechnologyUI._getTechColumn(
        scale,
        "blue",
        faction,
        playerTechSummary,
        onTechSelected
      ),
      ChooseTechnologyUI._getTechColumn(
        scale,
        "green",
        faction,
        playerTechSummary,
        onTechSelected
      ),
      ChooseTechnologyUI._getTechColumn(
        scale,
        "red",
        faction,
        playerTechSummary,
        onTechSelected
      ),
      ChooseTechnologyUI._getTechColumn(
        scale,
        "yellow",
        faction,
        playerTechSummary,
        onTechSelected
      ),
      ChooseTechnologyUI._getTechColumn(
        scale,
        "unit-upgrade",
        faction,
        playerTechSummary,
        onTechSelected
      ),
    ];

    const ui: AbstractUI = new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs(uis)
      .build();
    super(ui.getWidget(), ui.getSize());
    this._ui = ui;
    this._currentChoiceUi = currentChoice;

    selectTechButton.getButton().onClicked.add(this._onFetchTechClickHandler);
  }

  destroy(): void {
    this._ui.destroy();
  }
}
