import { readdir, lstat, mkdir, copyFile, readFile, writeFile, rename } from "node:fs/promises";
import path from "path";
import os from "os";

export const commandSwitcher = async (commandObj, currentPosition) => {
  const { command, params } = commandObj;
  let answer;
  let newPosition = currentPosition;
  switch (command) {
    case "up":
      if (!currentPosition.endsWith(":\\")) {
        newPosition = path.join(currentPosition, "..");
      }
      break;

    case "ls":
      answer = (await readdir(currentPosition)).join("\n");
      break;

    case "cd": {
      const handlePath = params[0];
      const newPath = path.join(currentPosition, handlePath);
      const itemInfo = await lstat(newPath);
      if (itemInfo.isDirectory()) newPosition = newPath;
      break;
    }

    case "cat": {
      const handlePath = params[0];
      const newPath = path.join(currentPosition, handlePath);
      answer = await readFile(newPath);
      break;
    }

    case "add": {
      const handlePath = params[0];
      const newPath = path.join(currentPosition, handlePath);
      answer = await writeFile(newPath, "");
      break;
    }

    case "rn":
      const [pathToFile, newFileName] = params;
      const pathToResourceFile = path.join(currentPosition, pathToFile);
      const pathToResourceFolder = path.dirname(pathToResourceFile);

      const pathToTargetFile = path.join(pathToResourceFolder, newFileName);

      await rename(pathToResourceFile, pathToTargetFile);
      break;

    case "os": {
      const flag = params[0];
      console.log("flag", flag);
      const result = await os[flag];
      console.log("r", result);
      answer = typeof result === "function" ? result() : result;
    }

    default:
    // console.log("default action");
  }
  return { answer, newPosition };
};
