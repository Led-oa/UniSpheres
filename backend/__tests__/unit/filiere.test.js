const FiliereService = require('../../src/services/filiere.service');
const FiliereModel = require('../../src/models/filiere.model');

jest.mock('../../src/models/filiere.model'); // on mock le modèle

describe('FiliereService', () => {
  const fakeRow = { id_filiere: 1, name: 'Sciences' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getAll retourne toutes les filières', async () => {
    FiliereModel.getAll.mockResolvedValue([fakeRow]);
    const result = await FiliereService.getAll();
    expect(result).toEqual([fakeRow]);
    expect(FiliereModel.getAll).toHaveBeenCalled();
  });

  test('getById retourne une filière existante', async () => {
    FiliereModel.getById.mockResolvedValue(fakeRow);
    const result = await FiliereService.getById(1);
    expect(result).toEqual(fakeRow);
    expect(FiliereModel.getById).toHaveBeenCalledWith(1);
  });

  test('getById lève une erreur si non trouvé', async () => {
    FiliereModel.getById.mockResolvedValue(null);
    await expect(FiliereService.getById(999))
      .rejects.toThrow('FiliereModel not found');
  });

  test('create insère une nouvelle filière', async () => {
    FiliereModel.create.mockResolvedValue(fakeRow);
    const result = await FiliereService.create({ name: 'Sciences' });
    expect(result).toEqual(fakeRow);
    expect(FiliereModel.create).toHaveBeenCalledWith({ name: 'Sciences' });
  });

  test('update modifie une filière existante', async () => {
    FiliereModel.update.mockResolvedValue(fakeRow);
    const result = await FiliereService.update(1, { name: 'Lettres' });
    expect(result).toEqual(fakeRow);
    expect(FiliereModel.update).toHaveBeenCalledWith(1, { name: 'Lettres' });
  });

  test('update lève une erreur si non trouvé', async () => {
    FiliereModel.update.mockResolvedValue(null);
    await expect(FiliereService.update(999, { name: 'X' }))
      .rejects.toThrow('DATABASE_ERROR');
  });

  test('delete supprime une filière existante', async () => {
    FiliereModel.delete.mockResolvedValue(true);
    const result = await FiliereService.delete(1);
    expect(result).toBe(true);
    expect(FiliereModel.delete).toHaveBeenCalledWith(1);
  });

  test('delete lève une erreur si non trouvé', async () => {
    FiliereModel.delete.mockResolvedValue(false);
    await expect(FiliereService.delete(999))
      .rejects.toThrow('DATABASE_ERROR');
  });
});
