import Web3 from "web3";

let web3;

const enableMeta = async () => {
    await window.ethereum.enable();
};

if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
    //We are in the browser and metamask is running
    web3 = new Web3(window.web3.currentProvider);
    enableMeta();
} else {
    // We are on the server *OR* the user is not running metamask
    const provider = new Web3.providers.HttpProvider(
        "https://rinkeby.infura.io/v3/33f420fcb0d049feb46730b08931fcfc"
    );
    web3 = new Web3(provider);
}

export default web3;
