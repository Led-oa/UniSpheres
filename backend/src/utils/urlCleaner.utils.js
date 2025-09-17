/**
 * Helper function to transform a server file path to a web URL
 * @param {string} filePath - The full server file path (e.g., 'D:\UniSphere\uploads\profile\image.jpg')
 * @returns {string} - Web-accessible URL (e.g., '/uploads/profile/image.jpg')
 */

const FilePathToUrl = {
  urlCleaner: (filePath) => {
    if (!filePath) return null;

    if (filePath.startsWith("/") || filePath.startsWith("http")) {
      return filePath;
    }

    const baseUrl = process.env.FRONTEND_BASE_URL || "http://localhost:8000";

    const match = filePath.match(/[\\\/]uploads[\\\/](.+)$/);
    if (match) {
      const relativePath = "/uploads/" + match[1].replace(/\\/g, "/");
      return `${baseUrl}${relativePath}`;
    }

    return filePath;
  },
};

module.exports = FilePathToUrl;
