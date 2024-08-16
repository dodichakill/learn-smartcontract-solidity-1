const assert = require("assert");
const ganache = require("ganache");
const { Web3 } = require("web3");
const { interface, bytecode } = require("../compile");

// contract test code will go here
const provider = ganache.provider();
const web3 = new Web3(provider);

let accounts;
let inbox;
const initialMessage = "Hi there!";

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();
  // Use one of those accounts to deploy
  // the contract
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: [initialMessage] })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Inbox", () => {
  it("deploys a contract", () => {
    assert.ok(inbox.options.address);
  });

  it("has a default message", async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, initialMessage);
  });

  it("can change the message", async () => {
    await inbox.methods.setMessage("Hello World!").send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, "Hello World!");
  });
});
