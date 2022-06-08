export const viewer = (data) => {
  if (data.isArray) {
    const result = "";
    for (const item of data) {
      result += JSON.stringify(item) + "\n";
    }
    return result;
  }
  return data;
};
