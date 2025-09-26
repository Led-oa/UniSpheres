const ParcoursService = require('../../src/services/parcours.service');
const ParcoursModel = require('../../src/models/parcours.model');

jest.mock('../../src/models/parcours.model'); // on mock le modèle

describe('ParcoursService', () => {
  const fakeRow = { id_parcours: 1, name: 'Informatique' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getAll retourne tous les parcours', async () => {
    ParcoursModel.getAll.mockResolvedValue([fakeRow]);
    const result = await ParcoursService.getAll();
    expect(result).toEqual([fakeRow]);
    expect(ParcoursModel.getAll).toHaveBeenCalled();
  });

  test('getById retourne un parcours existant', async () => {
    ParcoursModel.getById.mockResolvedValue(fakeRow);
    const result = await ParcoursService.getById(1);
    expect(result).toEqual(fakeRow);
    expect(ParcoursModel.getById).toHaveBeenCalledWith(1);
  });

  test('getById lève une erreur si non trouvé', async () => {
    ParcoursModel.getById.mockResolvedValue(null);
    await expect(ParcoursService.getById(999))
      .rejects.toThrow('ParcoursModel not found');
  });

  test('create insère un nouveau parcours', async () => {
    ParcoursModel.create.mockResolvedValue(fakeRow);
    const result = await ParcoursService.create({ name: 'Informatique' });
    expect(result).toEqual(fakeRow);
    expect(ParcoursModel.create).toHaveBeenCalledWith({ name: 'Informatique' });
  });

  test('update modifie un parcours existant', async () => {
    ParcoursModel.update.mockResolvedValue(fakeRow);
    const result = await ParcoursService.update(1, { name: 'Mathématiques' });
    expect(result).toEqual(fakeRow);
    expect(ParcoursModel.update).toHaveBeenCalledWith(1, { name: 'Mathématiques' });
  });

  test('update lève une erreur si non trouvé', async () => {
    ParcoursModel.update.mockResolvedValue(null);
    await expect(ParcoursService.update(999, { name: 'X' }))
      .rejects.toThrow('DATABASE_ERROR');
  });

  test('delete supprime un parcours existant', async () => {
    ParcoursModel.delete.mockResolvedValue(true);
    const result = await ParcoursService.delete(1);
    expect(result).toBe(true);
    expect(ParcoursModel.delete).toHaveBeenCalledWith(1);
  });

  test('delete lève une erreur si non trouvé', async () => {
    ParcoursModel.delete.mockResolvedValue(false);
    await expect(ParcoursService.delete(999))
      .rejects.toThrow('DATABASE_ERROR');
  });
});
