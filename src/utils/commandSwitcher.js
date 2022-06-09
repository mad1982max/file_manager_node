import { createReadStream, createWriteStream } from "fs";
import { readdir, lstat, cp, rm, readFile, writeFile, rename } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import path from "path";
import crypto from "crypto";
import os from "os";
import zlib from "zlib";

export const commandSwitcher = async (commandObj, currentPosition) => {
  try {
    const { command, params } = commandObj;
    let response;
    let newPosition = currentPosition;
    switch (command) {
      case "up":
        if (!currentPosition.endsWith(":\\")) {
          newPosition = path.join(currentPosition, "..");
        }
        break;

      case "ls":
        response = (await readdir(currentPosition)).join("\n  ");
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
        response = await readFile(newPath, "utf-8");
        break;
      }

      case "add": {
        const handlePath = params[0];
        const newPath = path.join(currentPosition, handlePath);
        await writeFile(newPath, "");
        break;
      }

      case "rn": {
        const [pathToFile, newFileName] = params;
        const pathToResourceFile = path.join(currentPosition, pathToFile);
        const pathToResourceFolder = path.dirname(pathToResourceFile);

        const pathToTargetFile = path.join(pathToResourceFolder, newFileName);

        await rename(pathToResourceFile, pathToTargetFile);
        break;
      }

      case "cp": {
        const [pathToFile, pathToDirectory] = params;
        const pathToResourceItem = path.join(currentPosition, pathToFile);
        const fileName = path.basename(pathToFile);
        const pathToTargetItem = path.join(currentPosition, pathToDirectory, fileName);
        console.log(pathToResourceItem, pathToTargetItem);
        await cp(pathToResourceItem, pathToTargetItem, { recursive: true });
        break;
      }

      case "mv": {
        const [pathToFile, pathToDirectory] = params;
        const pathToResourceItem = path.join(currentPosition, pathToFile);
        const fileName = path.basename(pathToFile);
        const pathToTargetItem = path.join(currentPosition, pathToDirectory, fileName);
        await cp(pathToResourceItem, pathToTargetItem, { recursive: true });
        await rm(pathToResourceItem);
        break;
      }

      case "rm": {
        const [pathToFile] = params;
        const pathToResourceItem = path.join(currentPosition, pathToFile);
        await rm(pathToResourceItem);
        break;
      }

      case "os": {
        const flag = params[0];
        if (!flag) throw err;
        if (flag === "architecture") {
          response = os.arch();
          break;
        }
        if (flag === "username") {
          response = os.userInfo().username;
          break;
        }

        const result = os[flag];
        response = typeof result === "function" ? result() : result;
        break;
      }

      case "hash": {
        const [pathToFile] = params;
        const pathToResourceItem = path.join(currentPosition, pathToFile);
        const fileBuffer = await readFile(pathToResourceItem);
        const hashSum = crypto.createHash("sha256");
        hashSum.update(fileBuffer);
        answer = hashSum.digest("hex");
        break;
      }
      case "compress": {
        const [pathToFile, pathToDestination] = params;
        const pathToResourceItem = path.join(currentPosition, pathToFile);
        const pathToTargetItem = path.join(currentPosition, pathToDestination);
        const brotli = zlib.createBrotliCompress();
        const input = createReadStream(pathToResourceItem);
        const output = createWriteStream(pathToTargetItem);
        await pipeline(input, brotli, output);
        break;
      }

      case "decompress": {
        const [pathToFile, pathToDestination] = params;
        const pathToResourceItem = path.join(currentPosition, pathToFile);
        const pathToTargetItem = path.join(currentPosition, pathToDestination);
        const unBrotli = zlib.createBrotliDecompress();
        const input = createReadStream(pathToResourceItem);
        const output = createWriteStream(pathToTargetItem);
        await pipeline(input, unBrotli, output);
        break;
      }

      case ".exit": {
        process.exit();
      }

      default:
      // console.log("default action");
    }
    return { response, newPosition };
  } catch (err) {
    throw err;
  }
};
