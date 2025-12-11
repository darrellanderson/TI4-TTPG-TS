import z from "zod";
import { DraftState } from "../draft-state/draft-state";
import { NamespaceId } from "ttpg-darrell";

const OpaqueTFSchema = z.object({
  s: z.number().optional(), // speaker priority
  h: z.number().optional(), // home system
  u: z.number().optional(), // starting units
});

export type OpaqueTFSchemaType = z.infer<typeof OpaqueTFSchema>;

/**
 * Store the extra [ speaker priority, home system, starting units ] in
 * the opaque data.  Speaker position is not a direct player choice.
 */
export class DraftStateTF extends DraftState {
  constructor(namespaceId: NamespaceId) {
    super(namespaceId);

    // One opaque per player.
    const opaques: Array<string> = new Array<string>(
      TI4.config.playerCount
    ).fill("{}");
    this.setOpaques(opaques);
  }

  _playerSlotToOpaqueIndex(playerSlot: number): number {
    const numOpaques: number = this.getOpaques().length;
    for (let i = 0; i < numOpaques; i++) {
      const owner: number = this.getOpaqueIndexToPlayerSlot(i);
      if (owner === playerSlot) {
        return i;
      }
    }
    return -1; // not a seated player
  }

  _getParsedOpaqueData(playerSlot: number): OpaqueTFSchemaType | undefined {
    const opaqueIndex: number = this._playerSlotToOpaqueIndex(playerSlot);
    if (opaqueIndex === -1) {
      return undefined;
    }

    const opaques: Array<string> = this.getOpaques();
    const opaque: string | undefined = opaques[opaqueIndex];
    if (opaque === undefined) {
      return {}; // no data, use an empty one
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

  _clearFactionRefNumber(
    opaqueData: OpaqueTFSchemaType,
    refNumber: number
  ): void {
    if (opaqueData.s === refNumber) {
      opaqueData.s = undefined;
    }
    if (opaqueData.h === refNumber) {
      opaqueData.h = undefined;
    }
    if (opaqueData.u === refNumber) {
      opaqueData.u = undefined;
    }
  }

  setSpeakerPriority(speakerPriority: number, playerSlot: number): boolean {
    const opaqueData: OpaqueTFSchemaType | undefined =
      this._getParsedOpaqueData(playerSlot);
    if (opaqueData === undefined) {
      return false;
    }
    this._clearFactionRefNumber(opaqueData, speakerPriority);
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

  hasSpeakerPriority(playerSlot: number): boolean {
    return this.getSpeakerPriority(playerSlot) !== -1;
  }

  setHomeSystem(homeSystem: number, playerSlot: number): boolean {
    const opaqueData: OpaqueTFSchemaType | undefined =
      this._getParsedOpaqueData(playerSlot);
    if (opaqueData === undefined) {
      return false;
    }
    this._clearFactionRefNumber(opaqueData, homeSystem);
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

  hasHomeSystem(playerSlot: number): boolean {
    return this.getHomeSystem(playerSlot) !== -1;
  }

  setStartingUnits(startingUnits: number, playerSlot: number): boolean {
    const opaqueData: OpaqueTFSchemaType | undefined =
      this._getParsedOpaqueData(playerSlot);
    if (opaqueData === undefined) {
      return false;
    }
    this._clearFactionRefNumber(opaqueData, startingUnits);
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

  hasStartingUnits(playerSlot: number): boolean {
    return this.getStartingUnits(playerSlot) !== -1;
  }

  _isOpaqueDataComplete(): boolean {
    const playerSlots: Array<number> = TI4.playerSeats
      .getAllSeats()
      .map((seat) => seat.playerSlot);
    for (const playerSlot of playerSlots) {
      if (
        !this.hasSpeakerPriority(playerSlot) ||
        !this.hasHomeSystem(playerSlot) ||
        !this.hasStartingUnits(playerSlot)
      ) {
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
