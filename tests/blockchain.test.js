const Blockchain = require('../blockchain/blockchain');
const Block = require('../blockchain/block');

describe('Blockchain', () => {
    let bc, bc2;
    beforeEach(() => {
        bc = new Blockchain();
        bc2 = new Blockchain();
    });

    it('Starts with the genesis block', () => {
        expect(bc.chain[0].hash).toEqual(Block.genesis().hash);
    });
    it('Adds a new block', () => {
        const data = 'foo';
        bc.addBlock(data);
        expect(bc.chain[bc.chain.length-1].data).toEqual(data);
    });
    it('Validates a valid chain', () => {
        bc2.addBlock('foo');
        expect(bc.isChainValid(bc2.chain)).toBe(true);
    });
    it('Invalidates a corrupt chain', () => {
        bc2.addBlock('foo');
        bc2.chain[1].data = 'bar';
        expect(bc.isChainValid(bc2.chain)).toBe(false);
    });
    it('Replace the chain with a valid chain', () => {
        bc2.addBlock('baz');
        bc.replaceChain(bc2.chain);
        expect(bc.chain).toEqual(bc2.chain);
    });
    it('Does not replace with a smaller or equal chain', () => {
        bc.addBlock('foo');
        bc.replaceChain(bc2.chain);
        expect(bc.chain).not.toEqual(bc2.chain);
    });
});

    