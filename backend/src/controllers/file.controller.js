const FileService = require("../services/file.service");

exports.create = async (req, res) => {
  try {
    // si tu utilises un middleware upload (multer), adapte en conséquence
    const { file_name, file_path, annonce_id, course_id, message_id } =
      req.body;
    const newFile = await FileService.create({
      file_name,
      file_path,
      annonce_id,
      course_id,
      message_id,
    });
    res.status(201).json({ success: true, data: newFile });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await FileService.update(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await FileService.remove(req.params.id);
    res.json({ success: true, message: "File deleted successfully" });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
