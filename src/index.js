import { argsConstructor } from "./utils/argsParsing.js";
import { templateGreeting, defaultGreetingKey, defaultTmpl, defaultName } from "./constants.js";
import { stdin, stdout } from "node:process";
import { Transform, Duplex } from "stream";
import { Stream } from "stream";

const args = process.argv.slice(2);
const argsObj = argsConstructor(args);

const userName = argsObj[defaultGreetingKey] || defaultName;
const greetingString = templateGreeting.replace(defaultTmpl, userName);

const stream = new Duplex({
  read(r) {
    // console.log(r);
  },
  // transform(chunk, encoding, cb) {
  //   this.push(chunk);
  //   cb();
  // },
  write(chunk, encoding, cb) {
    this.push(chunk);
    cb();
  },
});
stream.push(greetingString);

stdin.pipe(stream).pipe(stdout);
