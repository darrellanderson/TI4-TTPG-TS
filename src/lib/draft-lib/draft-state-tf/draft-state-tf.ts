import z from "zod";
import { DraftState } from "../draft-state/draft-state";

const OpaqueTFSchema = z.object({
  s: z.number().optional(), // speaker priority
  h: z.number().optional(), // home system
  u: z.number().optional(), // starting units
});

type OpaqueTFSchemaType = z.infer<typeof OpaqueTFSchema>;

/**
 * Store the extra [ speaker priority, home system, starting units ] in
 * the opaque data.  Speaker position is not a direct player choice.
 */
export class DraftStateTF extends DraftState {
  _playerSlotToOpaqueIndex(playerSlot: number): number {
    const numOpaques: number = this.getOpaques().length;
    for (let i = 0; i < numOpaques; i++) {
      const owner: number = this.getOpaqueIndexToPlayerSlot(i);
      if (owner === playerSlot) {
        return i;
      }
    }
    return -1;
  }

  _getParsedOpaqueData(playerSlot: number): OpaqueTFSchemaType | undefined {
    const opaqueIndex: number = this._playerSlotToOpaqueIndex(playerSlot);
    if (opaqueIndex === -1) {
      return undefined;
    }

    const opaques: Array<string> = this.getOpaques();
    const opaque: string | undefined = opaques[opaqueIndex];
    if (opaque === undefined) {
      return undefined;
    }

    return OpaqueTFSchema.parse(JSON.parse(opaque));
  }

  _setParsedOpaqueData(
    playerSlot: number,
    opaqueData: OpaqueTFSchemaType
  ): boolean {
    const opaqueIndex: number = this._playerSlotToOpaqueIndex(playerSlot);
    if (opaqueIndex === -1) {
      return false;
    }

    const opaques: Array<string> = this.getOpaques();
    opaques[opaqueIndex] = JSON.stringify(opaqueData);
    this.setOpaques(opaques);
    return true;
  }

  setSpeakerPriority(speakerPriority: number, playerSlot: number): boolean {
    const opaqueData: OpaqueTFSchemaType | undefined =
      this._getParsedOpaqueData(playerSlot);
    if (opaqueData === undefined) {
      return false;
    }
    opaqueData.s = speakerPriority;
    return this._setParsedOpaqueData(playerSlot, opaqueData);
  }

  getSpeakerPriority(playerSlot: number): number {
    const opaqueData: OpaqueTFSchemaType | undefined =
      this._getParsedOpaqueData(playerSlot);
    if (opaqueData === undefined || opaqueData.s === undefined) {
      return -1;
    }
    return opaqueData.s;
  }

  setHomeSystem(homeSystem: number, playerSlot: number): boolean {
    const opaqueData: OpaqueTFSchemaType | undefined =
      this._getParsedOpaqueData(playerSlot);
    if (opaqueData === undefined) {
      return false;
    }
    opaqueData.h = homeSystem;
    return this._setParsedOpaqueData(playerSlot, opaqueData);
  }

  getHomeSystem(playerSlot: number): number {
    const opaqueData: OpaqueTFSchemaType | undefined =
      this._getParsedOpaqueData(playerSlot);
    if (opaqueData === undefined || opaqueData.h === undefined) {
      return -1;
    }
    return opaqueData.h;
  }

  setStartingUnits(startingUnits: number, playerSlot: number): boolean {
    const opaqueData: OpaqueTFSchemaType | undefined =
      this._getParsedOpaqueData(playerSlot);
    if (opaqueData === undefined) {
      return false;
    }
    opaqueData.u = startingUnits;
    return this._setParsedOpaqueData(playerSlot, opaqueData);
  }

  getStartingUnits(playerSlot: number): number {
    const opaqueData: OpaqueTFSchemaType | undefined =
      this._getParsedOpaqueData(playerSlot);
    if (opaqueData === undefined || opaqueData.u === undefined) {
      return -1;
    }
    return opaqueData.u;
  }

  _isOpaqueDataComplete(): boolean {
    const playerSlots: Array<number> = TI4.playerSeats
      .getAllSeats()
      .map((seat) => seat.playerSlot);
    for (const playerSlot of playerSlots) {
      const seatPriority: number = this.getSpeakerPriority(playerSlot);
      if (seatPriority === -1) {
        return false;
      }
      const seatHomeSystem: number = this.getHomeSystem(playerSlot);
      if (seatHomeSystem === -1) {
        return false;
      }
      const seatStartingUnits: number = this.getStartingUnits(playerSlot);
      if (seatStartingUnits === -1) {
        return false;
      }
    }
    return true;
  }

  isComplete(): boolean {
    // Check if the opaque data is complete.
    if (!this._isOpaqueDataComplete()) {
      return false;
    }
    return super.isComplete();
  }
}
