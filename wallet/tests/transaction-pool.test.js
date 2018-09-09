const TransactionPool = require('../wallet/transaction-pool');
const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet');

describe('Transaction Pool', () => {
    let tp, wallet, transaction;
    beforeEach(() => {
        tp = new TransactionPool();
        wallet = new Wallet();
        transaction = Transaction.newTransaction(wallet, 'r4nd0m-4dr355', 30);
        tp.updateTransactions(transaction);
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

});