class InfoGeneriqueService {
  constructor(model) {
    this.model = model; // Ex: FiliereModel, ParcoursModel, YearModel
  }

  // Récupérer toutes les lignes
  async getAll() {
    try {
      const data = await this.model.getAll();
      return data;
    } catch (error) {
      console.error(`${this.model.table} getAll error:`, error);
      throw new Error("DATABASE_ERROR");
    }
  }

  // Récupérer une ligne par ID
  async getById(id) {
    try {
      const data = await this.model.getById(id);
      if (!data) throw new Error(`${this.model.table} not found`);
      return data;
    } catch (error) {
      console.error(`${this.model.table} getById error:`, error);
      throw error.message === "DATABASE_ERROR"
        ? new Error("DATABASE_ERROR")
        : error;
    }
  }

  // Créer une nouvelle ligne
  async create(data) {
    try {
      console.log("Service: data", data);
      const newRow = await this.model.create(data);
      return newRow;
    } catch (error) {
      console.error(`${this.model.table} create error:`, error);
      throw new Error("DATABASE_ERROR");
    }
  }

  // Mettre à jour une ligne
  async update(id, data) {
    try {
      const updatedRow = await this.model.update(id, data);
      if (!updatedRow) throw new Error(`${this.model.table} not found`);
      return updatedRow;
    } catch (error) {
      console.error(`${this.model.table} update error:`, error);
      throw new Error("DATABASE_ERROR");
    }
  }

  // Supprimer une ligne
  async delete(id) {
    try {
      console.log("Delete parcours : ", id);
      console.log("Model : ", this.model);
      const deleted = await this.model.delete(id);
      if (!deleted) throw new Error(`${this.model.table} not found`);
      return deleted;
    } catch (error) {
      console.error(`${this.model.table} delete error:`, error);
      throw new Error("DATABASE_ERROR");
    }
  }
}

module.exports = InfoGeneriqueService;
