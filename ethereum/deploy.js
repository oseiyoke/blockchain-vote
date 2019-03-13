const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/PollFactory.json");

const provider = new HDWalletProvider(
    "tooth rescue frown bicycle road during cup story spoil engage obey area",
    "https://rinkeby.infura.io/v3/33f420fcb0d049feb46730b08931fcfc"
);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log("Attempting to deploy from account", accounts[0]);

    const result = await new web3.eth.Contract(
        JSON.parse(compiledFactory.interface)
    )
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: "1000000" });

    console.log("Contract deployed to", result.options.address);
};

deploy();
