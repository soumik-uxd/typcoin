/**
 * Wallet Module
 * @module wallet/index
 */

const ChainUtil = require('../chain-util');
const { INIT_BALANCE } = require('../config');
const Transaction = require('./transaction');

/** Class representing the wallet of a peer in the P2P network */
class Wallet {
    /**
     * Creates a new wallet for a peer
     */
    constructor() {
        this.balance = INIT_BALANCE;
        this.keyPair = ChainUtil.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }
    /**
     * Dump the contents of the wallet
     * @returns {string} - output of the contents of the wallet
     */
    toString() {
        return `Wallet -
            Public Key  : ${this.publicKey.toString()}
            Balance     : ${this.balance}`;
    }
    
    sign(dataHash) {
        return this.keyPair.sign(dataHash);
    }

    createTransaction(recipient, amount, blockchain, transactionPool) {
        this.balance = this.calculateBalance(blockchain);
        if (amount > this.balance) {
            console.log(`Amount: ${amount} exceeds current balance: ${this.balance}`);
            return;
        }

        let transaction = transactionPool.existingTransaction(this.publicKey);

        if(transaction) {
            transaction.update(this, recipient, amount);
        } else {
            transaction = Transaction.newTransaction(this, recipient, amount);
            transactionPool.updateTransactions(transaction);
        }

        return transaction;
    }

    calculateBalance(blockchain) {
        let balance = this.balance;
        let transactions = [];
        blockchain.chain.forEach(block => block.data.forEach(transaction => {
            transactions.push(transaction);
        }));
        const walletInputTransactions = transactions
            .filter(transaction => transaction.input.address === this.publicKey);
        let startTime = 0;
        if (walletInputTransactions.length > 0) {
            const recentInputTransaction = walletInputTransactions.reduce(
                (prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current
            );
            balance = recentInputTransaction.outputs
                .find(output => output.address === this.publicKey).amount;
            startTime = recentInputTransaction.input.timestamp;
        }
        transactions.forEach(transaction => {
            if (transaction.input.timestamp > startTime) {
                transaction.outputs.find(output => {
                    if (output.address === this.publicKey) {
                        balance += output.amount;
                    }
                });
            }
        });
        return balance;
    }

    static blockchainWallet() {
        const blockchainWallet = new this();
        blockchainWallet.address = 'blockchain-wallet';
        return blockchainWallet;
    }
}

module.exports = Wallet;