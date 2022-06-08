export const insertDataInsteadTmpl = (stringWithTmpl, defaultTmpl, data) => {
  return stringWithTmpl.replace(defaultTmpl, data) + "\n";
};
