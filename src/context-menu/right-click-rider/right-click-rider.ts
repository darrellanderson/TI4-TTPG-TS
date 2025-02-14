import {
  GameObject,
  globalEvents,
  Player,
  world,
} from "@tabletop-playground/api";
import { IGlobal, NSID, OnCardBecameSingletonOrDeck } from "ttpg-darrell";

import { AgendaState } from "../../lib/agenda-lib/agenda-state/agenda-state";
import { ReportFinalAgendaState } from "../../lib/agenda-lib/agenda-state/report-final-agenda-state";

const ACTION_PREFIX_PREDICT: string = "*Predict ";
export const ACTION_CLEAR_PREDICT: string = "*Clear prediction";

/**
 * Add "predict {agenda outcome}", "clear agenda outcome" options to riders.
 * Updates when agenda state changes.
 */
export class RightClickRider implements IGlobal {
  private readonly _riderObjIds: Set<string> = new Set();

  private _agendaState: AgendaState | undefined = undefined;

  // Outcome names in outcome order.
  private _outcomeNames: Array<string> = [];
  private _outcomeNamesJoined: string = "";

  static _getOutcomeNames(agendaState: AgendaState): Array<string> {
    const outcomeNames: Array<string> = [];
    for (let i: number = 0; i < agendaState.getNumOutcomes(); i++) {
      const outcomeName: string | undefined = agendaState.getOutcomeName(i);
      if (outcomeName) {
        outcomeNames.push(outcomeName);
      }
    }
    return outcomeNames;
  }

  /**
   * Should this object have rider context menu options?
   *
   * @param obj
   * @returns
   */
  static _isRider(nsid: string): boolean {
    return nsid.endsWith("|rider");
  }

  init(): void {
    globalEvents.onObjectCreated.add((obj: GameObject): void => {
      this._maybeAddGameObject(obj);
    });
    globalEvents.onObjectDestroyed.add((obj: GameObject): void => {
      this._maybeRemoveGameObject(obj);
    });
    TI4.events.onAgendaStateCreated.add((agendaState: AgendaState): void => {
      this._agendaState = agendaState;
      agendaState.onAgendaStateChanged.add((agendaState: AgendaState): void => {
        this._onAgendaStateChange(agendaState);
      });
    });
    OnCardBecameSingletonOrDeck.onSingletonCardCreated.add(
      (obj: GameObject): void => {
        this._maybeAddGameObject(obj);
      }
    );
    OnCardBecameSingletonOrDeck.onSingletonCardMadeDeck.add(
      (obj: GameObject): void => {
        this._maybeRemoveGameObject(obj);
      }
    );

    const skipContained: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      this._maybeAddGameObject(obj);
    }
  }

  _maybeAddGameObject(obj: GameObject): void {
    const nsid: string = NSID.get(obj);
    if (RightClickRider._isRider(nsid)) {
      this._riderObjIds.add(obj.getId());
      obj.onCustomAction.remove(this._onCustomActionHanlder);
      obj.onCustomAction.add(this._onCustomActionHanlder);
    }
  }

  _maybeRemoveGameObject(obj: GameObject): void {
    const id: string = obj.getId();
    if (this._riderObjIds.has(id)) {
      this._riderObjIds.delete(id);
    }
  }

  _onAgendaStateChange(agendaState: AgendaState): void {
    const newOutcomeNames: Array<string> =
      RightClickRider._getOutcomeNames(agendaState);
    const newOutcomeNamesJoined: string = newOutcomeNames.join(",");

    if (newOutcomeNamesJoined !== this._outcomeNamesJoined) {
      this._removeActions(); // remove old actions
      this._outcomeNamesJoined = newOutcomeNamesJoined;
      this._outcomeNames = newOutcomeNames;
      this._addActions();
    }

    if (ReportFinalAgendaState.isComplete(agendaState)) {
      this._removeActions();
    }
  }

  _removeActions(): void {
    for (const objId of this._riderObjIds) {
      const obj: GameObject | undefined = world.getObjectById(objId);
      if (obj) {
        for (const outcomeName of this._outcomeNames) {
          obj.removeCustomAction(outcomeName); // identifier
        }
        obj.removeCustomAction(ACTION_CLEAR_PREDICT);
      }
    }
  }

  _addActions(): void {
    for (const objId of this._riderObjIds) {
      const obj: GameObject | undefined = world.getObjectById(objId);
      if (obj) {
        for (const outcomeName of this._outcomeNames) {
          const actionName: string = ACTION_PREFIX_PREDICT + outcomeName;
          const tooltip: string | undefined = undefined;
          obj.addCustomAction(actionName, tooltip, outcomeName);
        }
        obj.addCustomAction(ACTION_CLEAR_PREDICT);
      }
    }
  }

  /**
   * Attached to riders, update agenda state with rider->outcome link.
   *
   * @param obj
   * @param player
   * @param identifier
   * @returns
   */
  _onCustomActionHanlder = (
    obj: GameObject,
    player: Player,
    identifier: string
  ): void => {
    const playerSlot: number = player.getSlot();
    const seatIndex: number =
      TI4.playerSeats.getSeatIndexByPlayerSlot(playerSlot);
    const outcomeIndex: number = this._outcomeNames.indexOf(identifier);
    if (this._agendaState && seatIndex >= 0 && outcomeIndex >= 0) {
      this._agendaState.addRider(seatIndex, obj.getId(), outcomeIndex);
    }

    if (this._agendaState && identifier === ACTION_CLEAR_PREDICT) {
      this._agendaState.removeRider(obj.getId());
    }
  };
}
