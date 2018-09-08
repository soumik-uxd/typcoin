const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet');

describe('Transactions within the balance', () => {
    let transaction, wallet, recipient, amount;
    beforeEach(() => {
        wallet = new Wallet();
        amount = 50;
        recipient = 'r3c1p13nt';
        transaction = Transaction.newTransaction(wallet, recipient, amount);
    });

    it('Outputs the `amount` deducted from the wallet balance', () => {
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
            .toEqual(wallet.balance - amount);
    });
    it('Outputs the `amount` added to the recipient', () => {
        expect(transaction.outputs.find(output => output.address === recipient).amount)
            .toEqual(amount);
    });
    it('Inputs the balance of the wallet', () => {
        expect(transaction.input.amount).toEqual(wallet.balance);
    });
    it('Validates a valid transaction', () => {
        expect(Transaction.verifyTransaction(transaction)).toBe(true);
    });
    it('Invalidates a corrupt transaction', () => {
        transaction.outputs[0].amount = 50000;
        expect(Transaction.verifyTransaction(transaction)).toBe(false);
    });


    describe('Transactions with amount exceeding the balance', () => {
        beforeEach(() => {
            amount = 5000;
            transaction = Transaction.newTransaction(wallet, recipient, amount);
        });
    
        it('Does not not create the transaction', () => {
            expect(transaction).toEqual(undefined);
        });
    });

    describe('Updating a transaction', () => {
        let nextAmount, nextRecipient;
        beforeEach(() => {
            nextAmount = 20;
            nextRecipient = 'n3xt-4ddr3s';
            transaction = transaction.update(wallet,nextRecipient,nextAmount);
        });

        it('Deducts amount from the sender\'s wallet', () => {
            expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
                .toEqual(wallet.balance - amount - nextAmount);
        });
        it('Outputs an amount for the next recipient', () => {
            expect(transaction.outputs.find(output => output.address === nextRecipient).amount)
                .toEqual(nextAmount);
        });
    });
});



