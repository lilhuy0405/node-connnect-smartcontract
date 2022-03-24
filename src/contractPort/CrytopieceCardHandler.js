const {ethers, BigNumber} = require("ethers");
const {binanceSmartChainTestnetUrl, AddressZero} = require("./constants");
const {WritableCrytopieceCardContract, ReadOnlyCrytopieceCardContract} = require("./CrytopieceCardContract");
const {parseEther} = require("ethers/lib/utils");


class CrytopieceCardHandler {
  constructor() {
    this._provider = new ethers.providers.JsonRpcProvider(binanceSmartChainTestnetUrl)

    this._signer = new ethers.Wallet(process.env.WALLET_ACCOUNT_PRIAVATE_KEY, this._provider);

    this._writableContract = new WritableCrytopieceCardContract(this._signer);
    this._readOnlyContract = new ReadOnlyCrytopieceCardContract(this._provider);
  }

  //methods go here

  async getUserCardInfos(address) {
    if (!address || address === AddressZero) {
      throw new Error("address not found")
    }

    const cardInfosArr = await this._readOnlyContract.getUserCardInfos(address);
    const res = []
    for (let i = 0; i < cardInfosArr.length; i++) {
      let cardArr = cardInfosArr[i];
      let card = {
        cardType: cardArr[0].toNumber(),
        cardId: cardArr[1].toNumber(),
        cardElement: cardArr[2].toNumber(),
        cardLevel: cardArr[3].toNumber()
      }
      res.push(card)
    }
    return res;
  }

  async mintNft(address, cardType) {
    if (!address || address === AddressZero) {
      throw new Error("address not found")
    }
    const maxTypeBigNumber = await this._readOnlyContract.getMaxType();
    const maxType = maxTypeBigNumber.toNumber();

    if (cardType >= maxType) {
      throw new Error("cardType must be less than " + maxType)
    }
    const carTypeBigNumber = BigNumber.from(cardType);
    const txResponse = await this._writableContract.mintCard(address, carTypeBigNumber);
    const txReceipt = await txResponse.wait();
    return txReceipt.transactionHash;
  }


}

module.exports = CrytopieceCardHandler