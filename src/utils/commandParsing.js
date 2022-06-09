export const cliParsing = (cliInput) => {
  const clearedCliInput = cliInput.trim();
  if (clearedCliInput) {
    let [command, ...params] = clearedCliInput.split(" ");

    if (params.length > 0) {
      params = params.map((param) => {
        return param.startsWith("--") ? param.slice(2) : param;
      });
    }
    return { command: command.toLowerCase(), params };
  } else {
    return null;
  }
};
