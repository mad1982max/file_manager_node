import { stdin, stdout } from "node:process";
import { Transform, Duplex } from "node:stream";
import { readdir, lstat, mkdir, copyFile, readFile, writeFile } from "node:fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import os from "os";

import { argsConstructor } from "./utils/argsParsing.js";
import { insertDataInsteadTmpl } from "./utils/insertDataInsteadTmpl.js";
import {
  templateGreeting,
  defaultGreetingKey,
  defaultTmpl,
  defaultName,
  templateBye,
  currentPositionMessage,
  unknown_operation,
  execution_error,
} from "./constants.js";
import { commandParsing } from "./utils/commandParsing.js";
import { commandSwitcher } from "./utils/commandSwitcher.js";

let currentPosition =
  "C:\\Users\\Maksym_Bezrodnyi\\documents\\projects\\file_manager_node\\src" || os.homedir();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const argsObj = argsConstructor(args);

const userName = argsObj[defaultGreetingKey] || defaultName;
const greetingString = insertDataInsteadTmpl(templateGreeting, defaultTmpl, userName);
const buyString = insertDataInsteadTmpl(templateBye, defaultTmpl, userName);

const tunnel = new Transform({
  read(number) {
    // console.log("...reading ", number);
  },
  async transform(chunk, encoding, cb) {
    try {
      const inputData = encoding === "buffer" ? chunk.toString() : chunk;
      const parsedCommand = commandParsing(inputData);

      if (parsedCommand) {
        const { answer, newPosition } = await commandSwitcher(parsedCommand, currentPosition);
        currentPosition = newPosition;
        if (answer) this.push(answer + "\n");
        this.push(`${currentPositionMessage} ${currentPosition}\n`);
        cb();
      } else {
        this.push(`${unknown_operation}\n`);
        this.push(`${currentPositionMessage} ${currentPosition}\n`);
        cb();
      }
    } catch (e) {
      this.push(`${execution_error}\n`);
      this.push(`${currentPositionMessage} ${currentPosition}\n`);
      cb();
    }
  },
});

tunnel
  .on("close", () => console.log("close"))
  .on("error", () => console.log("error"))
  .on("finish", () => console.log("finish"))
  .on("end", () => console.log("end"));

process.on("SIGINT", function () {
  stdout.write(buyString);
  process.exit();
});

//Initial greeting and init position
tunnel.push(greetingString);
tunnel.push(`${currentPositionMessage} ${currentPosition}\n`);

stdin.setEncoding("utf-8");
stdin.pipe(tunnel).pipe(stdout);
