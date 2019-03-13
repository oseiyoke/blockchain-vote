import web3 from "./web3";
import HealthRecordFactory from "./build/PollFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(HealthRecordFactory.interface),
  "0x1654C74744354Fc4D5bef3aab04Aa5F179d3aabE"
);

export default instance;
