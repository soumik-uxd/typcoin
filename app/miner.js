/**
 * Miner module
 * @module app/miner
 */
const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet');

/** Class representing a miner which will mine a block */
class Miner {
    /**
     * Creates a new miner which will mine a block 
     * @param {Object} blockchain - chain to which blocks will be added
     * @param {Object} transactionPool - transaction pool from which transactions are checked
     * @param {Object} wallet - wallet of the miner 
     * @param {Object} p2pServer - p2pserver of the miner
     */
    constructor(blockchain, transactionPool, wallet, p2pServer) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.p2pServer = p2pServer;
    }
    /**
     * Mines the block by 
     *  - rewarding the miner
     *  - create a block of the valid transactions
     *  - sync all the chains in the p2p server
     *  - clear the transaction pool
     *  - broadcast to every peer in the p2p server to clear their transaction pool
     */
    mine() {
        const validTransactions = this.transactionPool.validTransactions();
        // Include a reward for the miner
        validTransactions.push(Transaction.rewardTransaction(this.wallet, 
            Wallet.blockchainWallet()));
        // Create a block consisting of the valid transactions
        const block = this.blockchain.addBlock(validTransactions);
        // Synchronize the chains in the P2P server
        this.p2pServer.syncChains();
        // Clear the transaction pool
        this.transactionPool.clear();
        // Broadcast to every miner to clear their transaction pools
        this.p2pServer.broadcastClearTransactions();

        return block;
    }
}

module.exports = Miner;
