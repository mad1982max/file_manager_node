export const viewer = (data) => {
  if (typeof data === "string") return `  ${data}`;
  if (Array.isArray(data)) {
    let result = `--Length of items is ${data.length}--\n\n`;
    for (const item of data) {
      result += "  " + JSON.stringify(item) + "\n\n";
    }
    return result;
  }
  return `  ${JSON.stringify(data)}`;
};
