import { REG_EXP_CLI_PARAMS } from "../constants.js";

export const argsConstructor = (args) => {
  const argsObj = {};

  for (let pair of args) {
    const matches = [...pair.match(REG_EXP_CLI_PARAMS)];

    if (matches) {
      const [, key, value] = matches;
      argsObj[key] = value;
    }
  }

  return argsObj;
};
