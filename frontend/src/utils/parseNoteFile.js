import * as XLSX from "xlsx";
import Papa from "papaparse";

/**
 * Transforme un fichier CSV ou Excel en array JSON prêt pour bulkUpsert
 * @param {File} file - fichier CSV ou Excel
 * @param {Array} students - liste des étudiants avec leur matricule et id_user
 * @param {Number} courseId - id du cours
 * @returns {Array} notesData
 */
export const parseNotesFile = async (file, students, courseId) => {
  let data = [];

  // --- Déterminer le type de fichier ---
  const fileExt = file.name.split(".").pop().toLowerCase();

  if (fileExt === "csv") {
    // Parser CSV
    data = await new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results.data),
        error: (err) => reject(err),
      });
    });
  } else if (fileExt === "xls" || fileExt === "xlsx") {
    // Parser Excel
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  } else {
    throw new Error("Format de fichier non supporté (CSV ou Excel attendu)");
  }

  // --- Transformer les données en format attendu par bulkUpsert ---
  const notesData = data
    .map((row) => {
      // Récupérer l'étudiant à partir du matricule
      const student = students.find((s) => s.matricule == row.matricule);
      if (!student) {
        console.warn(`Matricule ${row.matricule} introuvable`);
        return null; // Ignorer si étudiant non trouvé
      }

      return {
        course_id: courseId,
        student_id: student.id_user,
        note_ds: parseFloat(row["premiere note"] || row.note_ds) || 0,
        note_examen: parseFloat(row["examen"] || row.note_examen) || 0,
        note_final: parseFloat(row["final"] || row.note_final) || 0,
      };
    })
    .filter(Boolean); // supprimer les entrées null

  return notesData;
};
