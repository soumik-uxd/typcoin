/**
 * This module is used to write ad-hoc tests to check various code pieces during the dev process
 */

const Block = require('../blockchain/block');
const Blockchain = require('../blockchain/blockchain');
//const Wallet = require('../wallet');
 

/* const block = new Block('foo', 'bar', 'baz', 'zoo');
console.log(block.toString());
console.log(Block.genesis().toString()); */

/* const fooBlock = Block.mineBlock(Block.genesis(), 'foo');
console.log(fooBlock.toString());
 */

const bc = new Blockchain();

console.log(Block.genesis());
console.log(bc.chain[0]);
// for (let i=0; i<10; i++) {
//     console.log(bc.addBlock(`foo ${i}`).toString());
// }

// const wallet = new Wallet();
// console.log(wallet.toString());