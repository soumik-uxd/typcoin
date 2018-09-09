const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');

describe('Wallet', () => {
    let wallet, tp;

    beforeEach(() => {
        wallet = new Wallet();
        tp = new TransactionPool();
    });

    describe('Creating a transaction', () => {
        let transaction, sendAmount, recipient;

        beforeEach(() => {
            sendAmount = 50;
            recipient = 'r4nd0m-4dr355';
            transaction = wallet.createTransaction(recipient, sendAmount, tp);
        });

        describe('Updates when the same transaction is executed', () => {
            beforeEach(() => {
                wallet.createTransaction(recipient, sendAmount, tp);
            });

            it('Doubles the `sendAMount` deducted from the wallet balance', () => {
                expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
                    .toEqual(wallet.balance - (sendAmount * 2));
            });

            it('Clones the `sendAmount` output for the recipient', () => {
                expect(transaction.outputs.filter(output => output.address === recipient)
                    .map(output => output.amount)).toEqual([sendAmount, sendAmount]);
            });
        });
    });
});