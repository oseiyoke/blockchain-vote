import web3 from "./web3";
import PollFactory from "./build/PollFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(PollFactory.interface),
  "0xc1d252f0602f3212e85661e537Ab46674b93F0dE"
);

export default instance;
