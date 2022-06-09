import { stdin, stdout } from "node:process";
import { Transform } from "node:stream";
import os from "os";
import { viewer } from "./utils/viewer.js";
import { argsConstructor } from "./utils/argsParsing.js";
import { insertDataInsteadTmpl } from "./utils/insertDataInsteadTmpl.js";
import { cliParsing } from "./utils/commandParsing.js";
import { commandSwitcher } from "./utils/commandSwitcher.js";
import {
  TMPL_GREET,
  DEFAULT_GREET_KEY,
  DEFAULT_TMPL,
  DEFAULT_NAME,
  TMPL_BYE,
  CURRENT_POSITION_MESSAGE,
  INVALID_INPUT,
  OPERATION_FAILED,
} from "./constants.js";

let currentPosition = os.homedir();

const args = process.argv.slice(2);
const argsObj = argsConstructor(args);

const userName = argsObj[DEFAULT_GREET_KEY] || DEFAULT_NAME;
const greetingMessage = insertDataInsteadTmpl(TMPL_GREET, DEFAULT_TMPL, userName);
const byeMessage = insertDataInsteadTmpl(TMPL_BYE, DEFAULT_TMPL, userName);

const tunnel = new Transform({
  async transform(chunk, encoding, cb) {
    try {
      const inputData = encoding === "buffer" ? chunk.toString() : chunk;
      const parsedCliString = cliParsing(inputData);

      if (parsedCliString) {
        const { response, newPosition } = await commandSwitcher(parsedCliString, currentPosition);
        currentPosition = newPosition;
        if (response) {
          this.push(viewer(response) + "\n");
        }
        cb();
      } else {
        this.push(`${INVALID_INPUT}\n`);
        cb();
      }
      this.push(`${CURRENT_POSITION_MESSAGE} ${currentPosition}\n`);
    } catch (e) {
      this.push(`${OPERATION_FAILED}\n`);
      this.push(`${CURRENT_POSITION_MESSAGE} ${currentPosition}\n`);
      cb();
    }
  },
});

tunnel.on("error", (err) => console.log("error: ", err.message));

process.on("SIGINT", function () {
  process.exit();
});

process.on("exit", () => {
  stdout.write(byeMessage);
});

tunnel.push(greetingMessage);
tunnel.push(`${CURRENT_POSITION_MESSAGE} ${currentPosition}\n`);

stdin.setEncoding("utf-8");
stdin.pipe(tunnel).pipe(stdout);
