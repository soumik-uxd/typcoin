/**
 * Blockchain module
 * @module blockchain/blockchain
 */
const Block = require('./block');

/** Class representing the blockchain holding the blocks */
class Blockchain {
    /**
     * Creates a new blockchain, by adding a genesis block
     */
    constructor() {
        this.chain = [Block.genesis()];
    }
    /**
     * Mines and then adds a block to the current chain
     * @param {string} data - data to be added to the new block
     * @returns {Object} - new block 
     */
    addBlock(data) {
        const block = Block.mineBlock(this.chain[this.chain.length - 1], data);
        this.chain.push(block);

        return block;
    }
    /**
     * Validates the chain by checking the hashes
     * @param {Object} chain - blockchain to be validated
     * @returns {boolean} - validity of the chain (true if the chain is valid) 
     */
    isChainValid(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;

        for(let i=1; i < chain.length; i++) {
            const block = chain[i];
            const lastBlock = chain[i-1];

            if (block.lastHash !== lastBlock.hash || block.hash !== Block.blockHash(block)) return false;
        }

        return true;
    }
    /**
     * Update the current chain with a new longer version of it.
     * @param {*} newChain - new longer blockchain 
     */
    replaceChain(newChain) {
        if (newChain.length <= this.chain.length) {
            console.log('Received chain is not longer than the current chain');
            return;
        } else if (!this.isChainValid(newChain)) {
            console.log('The received chain is not valid.');
            return;
        }
        console.log('Replacing blockchain with the new chain');
        this.chain = newChain;
    }
}

module.exports = Blockchain;