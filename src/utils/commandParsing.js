export const commandParsing = (string) => {
  const clearedString = string.trim();
  if (clearedString) {
    let [command, ...params] = clearedString.split(" ");

    if (params.length > 0) {
      params = params.map((param) => {
        const cutParam = param.startsWith("--") ? param.slice(2) : param;
        return cutParam;
      });
    }
    const commandObj = { command: command.toLowerCase(), params };
    return commandObj;
  } else {
    return null;
  }
};
