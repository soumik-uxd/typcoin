/**
 * Block module
 * @module blockchain/block
 */
const ChainUtil = require('../chain-util');
const { DIFFICULTY, MINE_RATE } = require('../config');

/** Class representing a block in the blockchain */
class Block {
    /**
     * Create a new block
     * @param {number} timestamp - Time at which the block is created
     * @param {string} lastHash - Hash of the last block 
     * @param {string} hash - hash of the data of the current block
     * @param {string} data - data stored in the current block
     * @param {number} nonce - variance added to the hash to generate hash accepted by the difficulty rate
     * @param {number} difficulty - number of leading zeroes in a hash for acceptance
     */
    constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty || DIFFICULTY;
    }
    /**
     * Dumped output of the block contents
     * @returns {string} the content of the block
     */
    toString() {
        return `Block -
            Timestamp   : ${this.timestamp}
            Last Hash   : ${this.lastHash.substring(0, 10)}
            Hash        : ${this.hash.substring(0, 10)}
            Nonce       : ${this.nonce}
            Difficulty  : ${this.difficulty}
            Data        : ${this.data}`;
    }
    /**
     * Creates the genesis block
     * @returns {Object} - the genesis block
     */
    static genesis() {
        return new this(Date.now(), '0', '0000', [], 0, DIFFICULTY);
    }
    /**
     * Creates a hash of the block data supplied
     * @param {number} timestamp - timestamp of block creation
     * @param {string} lastHash - hash of the last block
     * @param {string} data - data of the block
     * @param {number} nonce - nonce of the block
     * @param {number} difficulty - difficulty of the block 
     * @returns {string} - hash of the block data supplied
     */
    static hash(timestamp, lastHash, data, nonce, difficulty) {
        return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`);
    }
    /**
     * Get the hash of the given block
     * @param {Object} block
     * @returns {string} - hash of the given block data
     */
    static blockHash(block) {
        const {timestamp, lastHash, data, nonce, difficulty} = block;
        return Block.hash(timestamp, lastHash, data, nonce, difficulty);
    }
    /**
     * Mines the current block to add the provided data to it
     * @param {Object} lastBlock - previous block
     * @param {string} data - data to be added to the current block
     * @returns {Object} - new mined block
     */
    static mineBlock(lastBlock, data) {
        let hash, timestamp;
        let nonce = 0;
        let { difficulty } = lastBlock;
        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty(lastBlock, timestamp);
            hash = Block.hash(timestamp, lastBlock.hash, data, nonce, difficulty);
        } while(hash.substring(0, difficulty) !== '0'.repeat(difficulty));
        return new this(timestamp, lastBlock.hash, hash, data, nonce, difficulty);
    }
    /**
     * Adjust the difficulty so that the mine rate stays constant
     * @param {Object} lastBlock - previous block
     * @param {number} currentTime - current time 
     * @returns {number} - new difficulty
     */
    static adjustDifficulty(lastBlock, currentTime) {
        let { difficulty } = lastBlock;
        difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
        return difficulty;
    }
}

module.exports = Block;