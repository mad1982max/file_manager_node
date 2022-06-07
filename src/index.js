import { argsConstructor } from "./utils/argsParsing.js";

const args = process.argv.slice(2);
const argsObj = argsConstructor(args);

console.log("-argsObj:", argsObj);
