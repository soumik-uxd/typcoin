const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');
const Blockchain = require('../blockchain/blockchain');
const { INIT_BALANCE } = require('../config');

describe('Wallet', () => {
    let wallet, tp, bc;

    beforeEach(() => {
        wallet = new Wallet();
        tp = new TransactionPool();
        bc = new Blockchain();
    });

    describe('Creating a transaction', () => {
        let transaction, sendAmount, recipient;

        beforeEach(() => {
            sendAmount = 50;
            recipient = 'r4nd0m-4dr355';
            transaction = wallet.createTransaction(recipient, sendAmount, bc, tp);
        });

        describe('Updates when the same transaction is executed', () => {
            beforeEach(() => {
                wallet.createTransaction(recipient, sendAmount, bc, tp);
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

    describe('Calculating a balance', () => {
        let addBalance, repeatAdd, senderWallet;
        beforeEach(() => {
            senderWallet = new Wallet();
            addBalance = 100;
            repeatAdd = 3;
            for(let i=0; i < repeatAdd;i++) {
                senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
            }
            bc.addBlock(tp.transactions);
        });
        it('Calculates the balance for blockchain transactions matching the recipient', () => {
            expect(wallet.calculateBalance(bc)).toEqual(INIT_BALANCE + (addBalance*repeatAdd));
        });
        it('Calculates the balance for blockchain transactions matching the sender', () => {
            expect(senderWallet.calculateBalance(bc)).toEqual(INIT_BALANCE - (addBalance*repeatAdd));
        });

        describe('Recipient conducts a transaction', () => {
            let subtractBalance, recipientBalance;
            beforeEach(() => {
                tp.clear();
                subtractBalance = 60;
                recipientBalance = wallet.calculateBalance(bc);
                wallet.createTransaction(senderWallet.publicKey, subtractBalance, bc, tp);
                bc.addBlock(tp.transactions);
            });

            describe('Sender sends another transaction', () => {
                beforeEach(() => {
                    tp.clear();
                    senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
                    bc.addBlock(tp.transactions);
                });
                it('Calculates the recipient balance via the recent one', () => {
                    expect(wallet.calculateBalance(bc)).toEqual(recipientBalance - subtractBalance + addBalance);
                });
            });
        });
    });
});