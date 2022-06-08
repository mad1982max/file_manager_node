import { stdin, stdout } from "node:process";
import { Transform, Duplex } from "stream";
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
} from "./constants.js";

const currentPosition = os.homedir();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const argsObj = argsConstructor(args);

const userName = argsObj[defaultGreetingKey] || defaultName;
const greetingString = insertDataInsteadTmpl(templateGreeting, defaultTmpl, userName);
const buyString = insertDataInsteadTmpl(templateBye, defaultTmpl, userName);

const stream = new Duplex({
  read(r) {
    // console.log(r);
  },
  transform(chunk, encoding, cb) {
    this.push(chunk);
    cb();
  },
  write(chunk, encoding, cb) {
    this.push(chunk);
    cb();
  },
});

stream
  .on("close", () => console.log("close"))
  .on("error", () => console.log("error"))
  .on("finish", () => console.log("finish"))
  .on("end", () => console.log("end"));

process.on("SIGINT", function () {
  console.log(buyString);
  process.exit();
});

//Initial greeting and init position
stream.push(greetingString + "\n");
stream.push(`${currentPositionMessage} ${currentPosition}\n`);

stdin.pipe(stream).pipe(stdout);
