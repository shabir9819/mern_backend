import path from "path";

const pathAdapter = {
  // Resolves a sequence of paths or path segments into an absolute path
  resolve: (...segments) => {
    try {
      const resolvedPath = path.resolve(...segments);
      return resolvedPath;
    } catch (error) {
      throw new Error(`Error resolving the path: ${error.message}`);
    }
  },

  // Normalizes a given path, resolving '..' and '.' segments
  normalize: (filePath) => {
    try {
      const normalizedPath = path.normalize(filePath);
      return normalizedPath;
    } catch (error) {
      throw new Error(`Error normalizing the path: ${error.message}`);
    }
  },

  // Joins all given path segments together using the platform-specific separator
  join: (...segments) => {
    try {
      const joinedPath = path.join(...segments);
      return joinedPath;
    } catch (error) {
      throw new Error(`Error joining the path: ${error.message}`);
    }
  },

  // Returns the directory name of a path
  dirname: (filePath) => {
    try {
      const dirName = path.dirname(filePath);
      return dirName;
    } catch (error) {
      throw new Error(`Error getting the directory name: ${error.message}`);
    }
  },

  // Returns the last portion of a path (the basename)
  basename: (filePath, ext) => {
    try {
      const baseName = path.basename(filePath, ext);
      return baseName;
    } catch (error) {
      throw new Error(`Error getting the basename: ${error.message}`);
    }
  },

  // Returns the extension of the path
  extname: (filePath) => {
    try {
      const extName = path.extname(filePath);
      return extName;
    } catch (error) {
      throw new Error(`Error getting the extension name: ${error.message}`);
    }
  },

  // Parses a path into an object with properties: root, dir, base, ext, name
  parse: (filePath) => {
    try {
      const parsedPath = path.parse(filePath);
      return parsedPath;
    } catch (error) {
      throw new Error(`Error parsing the path: ${error.message}`);
    }
  },

  // Formats a path object into a path string
  format: (pathObject) => {
    try {
      const formattedPath = path.format(pathObject);
      return formattedPath;
    } catch (error) {
      throw new Error(`Error formatting the path: ${error.message}`);
    }
  },

  // Checks if a path is an absolute path
  isAbsolute: (filePath) => {
    try {
      const isAbsolutePath = path.isAbsolute(filePath);
      return isAbsolutePath;
    } catch (error) {
      throw new Error(`Error checking if path is absolute: ${error.message}`);
    }
  },

  // Converts the given path to a path with forward slashes
  toUnix: (filePath) => {
    try {
      const unixPath = filePath.split(path.sep).join("/");
      return unixPath;
    } catch (error) {
      throw new Error(`Error converting to Unix path: ${error.message}`);
    }
  },

  // Converts the given path to a path with backslashes (Windows format)
  toWindows: (filePath) => {
    try {
      const windowsPath = filePath.split("/").join(path.sep);
      return windowsPath;
    } catch (error) {
      throw new Error(`Error converting to Windows path: ${error.message}`);
    }
  },
};

export default pathAdapter;
