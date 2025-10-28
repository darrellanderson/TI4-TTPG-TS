import {
  Button,
  Card,
  GameObject,
  Player,
  Vector,
  world,
} from "@tabletop-playground/api";
import {
  Find,
  NSID,
  OnCardBecameSingletonOrDeck,
  PlayerSlot,
  ThrottleClickHandler,
} from "ttpg-darrell";

import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { ButtonUI } from "../../button-ui/button-ui";
import { CONFIG } from "../../config/config";
import { VerticalUIBuilder } from "../../panel/vertical-ui-builder";
import { Faction } from "../../../lib/faction-lib/faction/faction";

const _find: Find = new Find();
let _tfAmbushId: string | undefined = undefined;
let _tfProximaTargetingId: string | undefined = undefined;

OnCardBecameSingletonOrDeck.onSingletonCardCreated.add((card: Card): void => {
  const nsid: string = NSID.get(card);
  if (nsid === "card.tf-ability:twilights-fall/ambush") {
    _tfAmbushId = card.getId();
  }
  if (nsid === "card.technology.red:thunders-edge/proxima-targeting-vi") {
    _tfProximaTargetingId = card.getId();
  }
});

function _getTfAmbushPlayerSlot(): PlayerSlot {
  if (_tfAmbushId) {
    const obj: GameObject | undefined = world.getObjectById(_tfAmbushId);
    if (obj) {
      const nsid: string = NSID.get(obj);
      if (nsid === "card.tf-ability:twilights-fall/ambush") {
        const pos: Vector = obj.getPosition();
        const playerSlot: PlayerSlot = _find.closestOwnedCardHolderOwner(pos);
        return playerSlot;
      }
    }
  }
  return -1;
}

function _getTfProximaTargetingPlayerSlot(): PlayerSlot {
  if (_tfProximaTargetingId) {
    const obj: GameObject | undefined = world.getObjectById(
      _tfProximaTargetingId
    );
    if (obj) {
      const nsid: string = NSID.get(obj);
      if (nsid === "card.technology.red:thunders-edge/proxima-targeting-vi") {
        const pos: Vector = obj.getPosition();
        const playerSlot: PlayerSlot = _find.closestOwnedCardHolderOwner(pos);
        return playerSlot;
      }
    }
  }
  return -1;
}

export class CombatUISpace extends AbstractUI {
  private readonly _spaceCannonOffense: Button;
  private readonly _ambush: Button;
  private readonly _antifighterBarrage: Button;
  private readonly _spaceCombat: Button;

  constructor(scale: number, playerSlot: PlayerSlot) {
    const planetName: string | undefined = undefined; // space

    const spaceCannonOffenseUi: ButtonUI = new ButtonUI(scale);
    spaceCannonOffenseUi.getButton().setText("Spc Cannon Offense");
    spaceCannonOffenseUi.getButton().onClicked.add(
      new ThrottleClickHandler<Button>((_button: Button, player: Player) => {
        TI4.events.onCombatClicked.trigger(
          "spaceCannonOffense",
          planetName,
          player
        );
      }).get()
    );

    const ambushUi: ButtonUI = new ButtonUI(scale);
    ambushUi.getButton().setText("Ambush");
    ambushUi.getButton().onClicked.add(
      new ThrottleClickHandler<Button>((_button: Button, player: Player) => {
        TI4.events.onCombatClicked.trigger("ambush", planetName, player);
      }).get()
    );

    const proximaTargetingUi: ButtonUI = new ButtonUI(scale);
    proximaTargetingUi.getButton().setText("Proxima Targeting");
    proximaTargetingUi.getButton().onClicked.add(
      new ThrottleClickHandler<Button>((_button: Button, player: Player) => {
        TI4.events.onCombatClicked.trigger("proximaTargeting", "???", player);
      }).get()
    );

    const antifighterBarrageUi: ButtonUI = new ButtonUI(scale);
    antifighterBarrageUi.getButton().setText("Anti-fighter Barrage");
    antifighterBarrageUi.getButton().onClicked.add(
      new ThrottleClickHandler<Button>((_button: Button, player: Player) => {
        TI4.events.onCombatClicked.trigger(
          "antiFighterBarrage",
          planetName,
          player
        );
      }).get()
    );

    const spaceCombatUi: ButtonUI = new ButtonUI(scale);
    spaceCombatUi.getButton().setText("Space Combat");
    spaceCombatUi.getButton().onClicked.add(
      new ThrottleClickHandler<Button>((_button: Button, player: Player) => {
        TI4.events.onCombatClicked.trigger("spaceCombat", planetName, player);
      }).get()
    );

    const uis: Array<AbstractUI> = [
      spaceCannonOffenseUi,
      ambushUi,
      antifighterBarrageUi,
      spaceCombatUi,
    ];

    let hasAmbush: boolean = false;
    const faction: Faction | undefined =
      TI4.factionRegistry.getByPlayerSlot(playerSlot);
    if (
      faction &&
      faction.getAbilityNsids().includes("faction-ability:base/ambush")
    ) {
      hasAmbush = true;
    }
    if (_getTfAmbushPlayerSlot() === playerSlot) {
      hasAmbush = true;
    }
    if (!hasAmbush) {
      uis.splice(1, 1); // prune ambush
    }

    let hasProximaTargeting: boolean = false;
    if (
      faction &&
      faction
        .getFactionTechNsids()
        .includes("card.technology.red:thunders-edge/proxima-targeting-vi")
    ) {
      hasProximaTargeting = true;
    }
    if (_getTfProximaTargetingPlayerSlot() === playerSlot) {
      hasProximaTargeting = true;
    }
    if (hasProximaTargeting) {
      uis.push(proximaTargetingUi);
    }

    const abstractUi: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING)
      .addUIs(uis)
      .build();

    super(abstractUi.getWidget(), abstractUi.getSize());

    this._spaceCannonOffense = spaceCannonOffenseUi.getButton();
    this._ambush = ambushUi.getButton();
    this._antifighterBarrage = antifighterBarrageUi.getButton();
    this._spaceCombat = spaceCombatUi.getButton();
  }

  destroy(): void {
    this._spaceCannonOffense.onClicked.clear();
    this._ambush.onClicked.clear();
    this._antifighterBarrage.onClicked.clear();
    this._spaceCombat.onClicked.clear();
  }

  getSpaceCannonOffense(): Button {
    return this._spaceCannonOffense;
  }

  getAmbush(): Button {
    return this._ambush;
  }

  getAntifighterBarrage(): Button {
    return this._antifighterBarrage;
  }

  getSpaceCombat(): Button {
    return this._spaceCombat;
  }
}
