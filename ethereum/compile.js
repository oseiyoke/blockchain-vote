const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const contractPath = path.resolve(__dirname, "contracts", "Poll.sol");
const source = fs.readFileSync(contractPath, "utf-8");
const output = solc.compile(source, 1).contracts;

fs.ensureDirSync(buildPath);

for (let contract in output) {
    fs.outputJSONSync(
        path.resolve(buildPath, contract.replace(":", "") + ".json"),
        output[contract]
    );
}
