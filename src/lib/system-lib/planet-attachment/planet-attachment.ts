import {
  GameObject,
  Vector,
  refPackageId,
  world,
} from "@tabletop-playground/api";
import { Facing } from "ttpg-darrell";
import { PlanetAttachmentSchemaType } from "../schema/planet-attachment-schema";

export class PlanetAttachment {
  private readonly _params: PlanetAttachmentSchemaType;
  private _attachmentObjId: string | undefined;

  constructor(params: PlanetAttachmentSchemaType) {
    this._params = params;
    Object.freeze(this._params);
  }

  // TODO XXX
}
