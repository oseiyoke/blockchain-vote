import web3 from "./web3";
import Poll from "./build/Poll.json";

export default address => {
    return new web3.eth.Contract(JSON.parse(Poll.interface), address);
};
