import web3 from "./web3";
import HealthRecordFactory from "./build/PollFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(HealthRecordFactory.interface),
  "0x33781f2E724Fd1C8F5F0C6028Cbb0618Fc9212E6"
);

export default instance;
