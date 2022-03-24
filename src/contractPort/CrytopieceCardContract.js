const {Contract} = require("ethers");
const {crytopieceCardContractAddress} = require("./constants");
const ABI = require("./abis/crytopieceCard.json")

class ReadOnlyCrytopieceCardContract {
  _contract

  constructor(provider) {
    this._contract = new Contract(crytopieceCardContractAddress, ABI, provider)
  }

  async getUserCardInfos(address) {
    return this._contract.inventoryCardInfos(address);
  }

  async getMaxElement() {
    return this._contract.maxElement();
  }

  async getMaxLevel() {
    return this._contract.maxLevel();
  }

  async getMaxType() {
    return this._contract.maxType();
  }
}


class WritableCrytopieceCardContract {
  _contract

  constructor(signer) {
    this._contract = new Contract(crytopieceCardContractAddress, ABI, signer)
  }

  async mintCard(address, cardType) {
    //If you have two methods with the same name, you must specify the fully qualified signature to access it
    return this._contract['mintNFT(address,uint256)'](address, cardType, {
      gasLimit: 1000000
    });
  }

}

module.exports = {
  ReadOnlyCrytopieceCardContract,
  WritableCrytopieceCardContract
}