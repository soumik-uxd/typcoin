//const Block = require('../blockchain/block');
//const Blockchain = require('../blockchain/blockchain');
const Wallet = require('../wallet');
 

/* const block = new Block('foo', 'bar', 'baz', 'zoo');
console.log(block.toString());
console.log(Block.genesis().toString()); */

/* const fooBlock = Block.mineBlock(Block.genesis(), 'foo');
console.log(fooBlock.toString());
 */

/* const bc = new Blockchain();

for (let i=0; i<10; i++) {
    console.log(bc.addBlock(`foo ${i}`).toString());
} */

const wallet = new Wallet();
console.log(wallet.toString());