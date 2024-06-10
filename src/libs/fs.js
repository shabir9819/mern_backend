import fs from "fs/promises";
import fsSync from "fs";

const fsAdapter = {
  // Asynchronous methods
  readFile: async (filePath, encoding = "utf8") => {
    try {
      const data = await fs.readFile(filePath, encoding);
      return data;
    } catch (error) {
      throw new Error(`Error reading file: ${error.message}`);
    }
  },

  writeFile: async (filePath, data, encoding = "utf8") => {
    try {
      await fs.writeFile(filePath, data, encoding);
    } catch (error) {
      throw new Error(`Error writing file: ${error.message}`);
    }
  },

  appendFile: async (filePath, data, encoding = "utf8") => {
    try {
      await fs.appendFile(filePath, data, encoding);
    } catch (error) {
      throw new Error(`Error appending file: ${error.message}`);
    }
  },

  unlink: async (filePath) => {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      throw new Error(`Error deleting file: ${error.message}`);
    }
  },

  mkdir: async (dirPath, options) => {
    try {
      await fs.mkdir(dirPath, options);
    } catch (error) {
      throw new Error(`Error creating directory: ${error.message}`);
    }
  },

  rmdir: async (dirPath, options) => {
    try {
      await fs.rmdir(dirPath, options);
    } catch (error) {
      throw new Error(`Error removing directory: ${error.message}`);
    }
  },

  readdir: async (dirPath, options) => {
    try {
      const files = await fs.readdir(dirPath, options);
      return files;
    } catch (error) {
      throw new Error(`Error reading directory: ${error.message}`);
    }
  },

  stat: async (filePath) => {
    try {
      const stats = await fs.stat(filePath);
      return stats;
    } catch (error) {
      throw new Error(`Error getting file stats: ${error.message}`);
    }
  },

  access: async (filePath, mode) => {
    try {
      await fs.access(filePath, mode);
    } catch (error) {
      throw new Error(`Error accessing file: ${error.message}`);
    }
  },

  // Synchronous methods
  readFileSync: (filePath, encoding = "utf8") => {
    try {
      const data = fsSync.readFileSync(filePath, encoding);
      return data;
    } catch (error) {
      throw new Error(`Error reading file: ${error.message}`);
    }
  },

  writeFileSync: (filePath, data, encoding = "utf8") => {
    try {
      fsSync.writeFileSync(filePath, data, encoding);
    } catch (error) {
      throw new Error(`Error writing file: ${error.message}`);
    }
  },

  appendFileSync: (filePath, data, encoding = "utf8") => {
    try {
      fsSync.appendFileSync(filePath, data, encoding);
    } catch (error) {
      throw new Error(`Error appending file: ${error.message}`);
    }
  },

  unlinkSync: (filePath) => {
    try {
      fsSync.unlinkSync(filePath);
    } catch (error) {
      throw new Error(`Error deleting file: ${error.message}`);
    }
  },

  mkdirSync: (dirPath, options) => {
    try {
      fsSync.mkdirSync(dirPath, options);
    } catch (error) {
      throw new Error(`Error creating directory: ${error.message}`);
    }
  },

  rmdirSync: (dirPath, options) => {
    try {
      fsSync.rmdirSync(dirPath, options);
    } catch (error) {
      throw new Error(`Error removing directory: ${error.message}`);
    }
  },

  readdirSync: (dirPath, options) => {
    try {
      const files = fsSync.readdirSync(dirPath, options);
      return files;
    } catch (error) {
      throw new Error(`Error reading directory: ${error.message}`);
    }
  },

  statSync: (filePath) => {
    try {
      const stats = fsSync.statSync(filePath);
      return stats;
    } catch (error) {
      throw new Error(`Error getting file stats: ${error.message}`);
    }
  },

  accessSync: (filePath, mode) => {
    try {
      fsSync.accessSync(filePath, mode);
    } catch (error) {
      throw new Error(`Error accessing file: ${error.message}`);
    }
  },
};

export default fsAdapter;
