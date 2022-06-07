import { regExpForParsing } from "../constants.js";

export const argsConstructor = (args) => {
  const argsObj = {};

  for (let pair of args) {
    const matches = [...pair.match(regExpForParsing)];

    if (matches) {
      const [, key, value] = matches;
      argsObj[key] = value;
    }
  }

  return argsObj;
};
