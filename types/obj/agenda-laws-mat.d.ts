import { GameObject, Zone } from "@tabletop-playground/api";
export declare class AgendaLawsMat {
    private readonly _obj;
    private readonly _firstSnapPoint;
    private readonly _zone;
    private readonly onSnappedToHandler;
    private readonly onEndOverlapHandler;
    constructor(obj: GameObject);
    _findOrCreateZone(): Zone;
}
