const YearService = require("../../src/services/year.service");
const YearModel = require("../../src/models/year.model");

jest.mock("../../src/models/year.model"); // on mock le modèle

describe("YearService", () => {
  const fakeRow = { id_year: 1, year_value: "licence 1" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getAll retourne toutes les années", async () => {
    YearModel.getAll.mockResolvedValue([fakeRow]);
    const result = await YearService.getAll();
    expect(result).toEqual([fakeRow]);
    expect(YearModel.getAll).toHaveBeenCalled();
  });

  test("getById retourne une année existante", async () => {
    YearModel.getById.mockResolvedValue(fakeRow);
    const result = await YearService.getById(1);
    expect(result).toEqual(fakeRow);
    expect(YearModel.getById).toHaveBeenCalledWith(1);
  });

  test("getById lève une erreur si non trouvé", async () => {
    YearModel.getById.mockResolvedValue(null);
    await expect(YearService.getById(999)).rejects.toThrow(
      "YearModel not found"
    );
  });

  test("create insère une nouvelle année", async () => {
    YearModel.create.mockResolvedValue(fakeRow);
    const result = await YearService.create({ year_value: "licence 1" });
    expect(result).toEqual(fakeRow);
    expect(YearModel.create).toHaveBeenCalledWith({ year_value: "licence 1" });
  });

  test("update modifie une année existante", async () => {
    YearModel.update.mockResolvedValue(fakeRow);
    const result = await YearService.update(1, { year_value: "licence 2" });
    expect(result).toEqual(fakeRow);
    expect(YearModel.update).toHaveBeenCalledWith(1, {
      year_value: "licence 2",
    });
  });

  test("update lève une erreur si non trouvé", async () => {
    YearModel.update.mockResolvedValue(null);
    await expect(YearService.update(999, { year_value: "X" })).rejects.toThrow(
      "DATABASE_ERROR"
    );
  });

  test("delete supprime une année existante", async () => {
    YearModel.delete.mockResolvedValue(true);
    const result = await YearService.delete(1);
    expect(result).toBe(true);
    expect(YearModel.delete).toHaveBeenCalledWith(1);
  });

  test("delete lève une erreur si non trouvé", async () => {
    YearModel.delete.mockResolvedValue(false);
    await expect(YearService.delete(999)).rejects.toThrow("DATABASE_ERROR");
  });
});
