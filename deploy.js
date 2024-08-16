require("dotenv").config();

const HDWalletProvider = require("@truffle/hdwallet-provider");
const { Web3 } = require("web3");
const { interface, bytecode } = require("./compile");

/**
 * The Web3 provider that will be used to connect to the Ethereum node.
 *
 * The provider is an instance of the `HDWalletProvider` class from the
 * `@truffle/hdwallet-provider` package. This class is used to connect to an
 * Ethereum node using a private key derived from a mnemonic phrase stored in
 * the `PHRASE_WALLET_KEY` environment variable.
 *
 * The provider is configured to connect to the Ethereum node at `https://sepolia.infura.io/v3/`
 * and authenticate using the `INFURA_API_KEY` environment variable.
 *
 * @type {HDWalletProvider}
 */
const provider = new HDWalletProvider(
  process.env.PHRASE_WALLET_KEY,
  "https://sepolia.infura.io/v3/" + process.env.INFURA_API_KEY
);

const web3 = new Web3(provider);

/**
 * Deploys a smart contract to the Ethereum blockchain.
 *
 * @return {object} The result of the contract deployment
 */
const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("Attempting to deploy from account", accounts[0]);
  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: ["Hi there!"],
    })
    .send({ gas: "1000000", from: accounts[0] });

  console.log("Contract deployed to", result.options.address);
  provider.engine.stop();
};

deploy();
