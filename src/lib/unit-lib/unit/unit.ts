export type UnitParams = {
  unit: string; // "dreadnought"
  count: number;
};

export class Unit {
  private readonly _unit: string;
  private _count: number = 0;

  constructor(params: UnitParams) {
    this._unit = params.unit;
  }

  getCount(): number {
    return this._count;
  }

  setCount(value: number): this {
    if (value < 0) {
      throw new Error(`invalid value (${value})`);
    }
    this._count = value;
    return this;
  }
}
