import { EntityType } from "./hex-summary-codes";
import { SortEntityType } from "./sort-entity-type";

it("sort (region)", () => {
  const entities: Array<EntityType> = [
    { code: "a", planetIndex: -1, count: 1 },
    { code: "c", planetIndex: 1, count: 1 },
    { code: "b", planetIndex: 0, count: 1 },
  ];

  const sorter: SortEntityType = new SortEntityType();
  sorter.sort(entities);

  const codes: Array<string> = entities.map(
    (entity: EntityType) => entity.code
  );
  expect(codes).toEqual(["a", "b", "c"]);
});

it("sort (attachments last)", () => {
  const entities: Array<EntityType> = [
    { code: "a", planetIndex: -1, count: 1 },
    { code: "c", planetIndex: -1, count: 1, attachment: true },
    { code: "b", planetIndex: -1, count: 1 },
  ];

  const sorter: SortEntityType = new SortEntityType();
  sorter.sort(entities);

  const codes: Array<string> = entities.map(
    (entity: EntityType) => entity.code
  );
  expect(codes).toEqual(["a", "b", "c"]);
});

it("sort (color)", () => {
  const entities: Array<EntityType> = [
    { code: "a", planetIndex: -1, count: 1, colorCode: undefined },
    { code: "c", planetIndex: -1, count: 1, colorCode: "W" },
    { code: "b", planetIndex: -1, count: 1, colorCode: "B" },
  ];

  const sorter: SortEntityType = new SortEntityType();
  sorter.sort(entities);

  const codes: Array<string> = entities.map(
    (entity: EntityType) => entity.code
  );
  expect(codes).toEqual(["a", "b", "c"]);
});

it("sort (tokens last in region)", () => {
  const entities: Array<EntityType> = [
    { code: "a", planetIndex: -1, count: 1 },
    { code: "c", planetIndex: -1, count: 1, token: true },
    { code: "b", planetIndex: -1, count: 1 },
  ];

  const sorter: SortEntityType = new SortEntityType();
  sorter.sort(entities);

  const codes: Array<string> = entities.map(
    (entity: EntityType) => entity.code
  );
  expect(codes).toEqual(["a", "b", "c"]);
});

it("sort (count)", () => {
  const entities: Array<EntityType> = [
    { code: "a", planetIndex: -1, count: 1 },
    { code: "c", planetIndex: -1, count: 3 },
    { code: "b", planetIndex: -1, count: 2 },
  ];

  const sorter: SortEntityType = new SortEntityType();
  sorter.sort(entities);

  const codes: Array<string> = entities.map(
    (entity: EntityType) => entity.code
  );
  expect(codes).toEqual(["a", "b", "c"]);
});

it("sort (tie breaker)", () => {
  const entities: Array<EntityType> = [
    { code: "a", planetIndex: -1, count: 1 },
    { code: "c", planetIndex: -1, count: 1 },
    { code: "b", planetIndex: -1, count: 1 },
  ];

  const sorter: SortEntityType = new SortEntityType();
  sorter.sort(entities);

  const codes: Array<string> = entities.map(
    (entity: EntityType) => entity.code
  );
  expect(codes).toEqual(["a", "b", "c"]);
});
