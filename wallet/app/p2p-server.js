const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
const MSG_TYPES = {
    chain       : 'CHAIN',
    transaction : 'TRANSACTION'
};
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

class P2PServer {
    constructor(blockchain, transactionPool) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.sockets = [];
    }

    listen() {
        const server = new Websocket.Server({port: P2P_PORT});
        server.on('connection', socket => this.connectSocket(socket));
        this.connectToPeers();
        console.log(`Listening for P2P connections on: ${P2P_PORT}`);
    }

    connectSocket(socket) {
        this.sockets.push(socket);
        console.log('Socket connected..');
        this.msgHandler(socket);
        this.sendChain(socket);
    }

    connectToPeers() {
        peers.forEach(peer => {
            const socket = new Websocket(peer);
            socket.on('open', () => this.connectSocket(socket));
        });
    }

    msgHandler(socket) {
        socket.on('message', msg => {
            const data = JSON.parse(msg);

            switch(data.type) {
                case MSG_TYPES.chain:
                    this.blockchain.replaceChain(data.chain);
                    break;
                case MSG_TYPES.transaction:
                    this.transactionPool.updateTransactions(data.transaction);         
                    break;
            }
        });
    }

    sendChain(socket) {
        socket.send(JSON.stringify({
            type    : MSG_TYPES.chain,
            chain   : this.blockchain.chain
        }));
    }

    syncChains() {
        this.sockets.forEach(socket => this.sendChain(socket));
    }

    sendTransaction(socket, transaction) {
        socket.send(JSON.stringify({
            type        : MSG_TYPES.transaction,
            transaction
        }));
    }

    broadcastTransaction(transaction) {
        this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
    }
}

module.exports = P2PServer;