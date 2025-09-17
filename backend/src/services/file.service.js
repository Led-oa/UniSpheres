const FileModel = require("../models/file.model");

const FileService = {
  async create(data) {
    try {
      return await FileModel.create(data);
    } catch (err) {
      console.error("FileService.create error:", err);
      throw new Error("FILE_CREATE_FAILED");
    }
  },

  async update(id, data) {
    const updated = await FileModel.update(id, data);
    if (!updated) throw new Error("FILE_UPDATE_FAILED");
    return updated;
  },

  async remove(id) {
    const ok = await FileModel.remove(id);
    if (!ok) throw new Error("FILE_DELETE_FAILED");
    return true;
  },
};

module.exports = FileService;
