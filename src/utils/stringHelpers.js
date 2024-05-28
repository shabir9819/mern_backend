const convertToString = (value) => {
  if (typeof value === "string") {
    return value;
  } else if (
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "symbol" ||
    value === null ||
    value === undefined
  ) {
    return String(value);
  } else if (typeof value === "function") {
    return value.toString();
  } else if (Array.isArray(value)) {
    return "[" + value.map((item) => convertToString(item)).join(", ") + "]";
  } else if (typeof value === "object") {
    let result = "{";
    for (let key in value) {
      if (value.hasOwnProperty(key)) {
        result += `${key}: ${convertToString(value[key])}, `;
      }
    }
    result = result.slice(0, -2); // Remove the last comma and space
    result += "}";
    return result;
  } else {
    return "[object " + typeof value + "]"; // Fallback for other types
  }
};

export { convertToString };
