const ChainUtil = require('../chain-util');
const { INIT_BALANCE } = require('../config');

class Wallet {
    constructor() {
        this.balance = INIT_BALANCE;
        this.keyPair = ChainUtil.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    toString() {
        return `Wallet -
            Public Key  : ${this.publicKey.toString()}
            Balance     : ${this.balance}`;
    }

    sign(dataHash) {
        return this.keyPair.sign(dataHash);
    }
}

module.exports = Wallet;