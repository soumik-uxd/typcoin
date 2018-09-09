const TransactionPool = require('../wallet/transaction-pool');
const Transaction = require('../wallet/transaction');
const Blockchain = require('../blockchain/blockchain');
const Wallet = require('../wallet');

describe('Transaction Pool', () => {
    let tp, wallet, transaction, bc;
    beforeEach(() => {
        tp = new TransactionPool();
        wallet = new Wallet();
        bc = new Blockchain();
        transaction = wallet.createTransaction('r4nd0m-4dr355', 30, bc, tp);
    });

    it('Adds a transaction to the pool', () => {
        expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
    });
    it('Updates a transaction in the pool', () => {
        const oldTransaction = JSON.stringify(transaction);
        const newTransaction = transaction.update(wallet, 'f00-4dr355', 40);
        tp.updateTransactions(newTransaction);

        expect(JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id)))
            .not.toEqual(oldTransaction);
    });
    it('Clears transactions', () => {
        tp.clear();
        expect(tp.transactions).toEqual([]);
    });

    describe('Mixing valid and corrupt transactions', () => {
        let validTransactions;

        beforeEach(() => {
            validTransactions = [...tp.transactions];
            for(let i=0; i<6; i++) {
                wallet = new Wallet();
                transaction = wallet.createTransaction('r4nd0m-4dr355', 30, bc, tp);
                if (i%2 == 0) {
                    transaction.input.amount = 99999;
                } else {
                    validTransactions.push(transaction);
                }
            }
        });
        it('Shows a difference between valid and corrupt transactions', () => {
            expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
        });
        it('Finds valid transactions', () => {
            expect(tp.validTransactions()).toEqual(validTransactions);
        });
    });
});