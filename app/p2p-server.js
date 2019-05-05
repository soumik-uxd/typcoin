/**
 * P2P Server Module
 * @module app/p2p-server
 */
const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
const MSG_TYPES = {
    chain               : 'CHAIN',
    transaction         : 'TRANSACTION',
    clear_transactions  : 'CLEAR_TRANSACTIONS'
};
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

/** Class representing the P2P server for a peer in the p2p network */
class P2PServer {
    /**
     * Create a new P2P server 
     * @param {Object} blockchain - blockchain of the peer
     * @param {*} transactionPool - transaction pool of the peer
     */
    constructor(blockchain, transactionPool) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.sockets = [];
    }
    /**
     * Listen on the port for the peer 
     */
    listen() {
        const server = new Websocket.Server({port: P2P_PORT});
        server.on('connection', socket => this.connectSocket(socket));
        this.connectToPeers();
        console.log(`Listening for P2P connections on: ${P2P_PORT}`);
    }
    /**
     * Connect to a given web socket and send the blockchain to it
     * @param {Object} socket - web socket to connect to
     */
    connectSocket(socket) {
        this.sockets.push(socket);
        console.log('Socket connected..');
        this.msgHandler(socket);
        this.sendChain(socket);
    }
    /**
     * Connect to every peer in the P2P network
     */
    connectToPeers() {
        peers.forEach(peer => {
            const socket = new Websocket(peer);
            socket.on('open', () => this.connectSocket(socket));
        });
    }
    /**
     * Handle the message from another web socket
     * @param {Object} socket 
     */
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
                case MSG_TYPES.clear_transactions:
                    this.transactionPool.clear();
                    break;
            }
        });
    }
    /**
     * Send the current chain to another websocket
     * @param {Object} socket - socket to send the current chain to 
     */
    sendChain(socket) {
        socket.send(JSON.stringify({
            type    : MSG_TYPES.chain,
            chain   : this.blockchain.chain
        }));
    }
    /**
     * Send the current chain to every chain in the socket
     */
    syncChains() {
        this.sockets.forEach(socket => this.sendChain(socket));
    }
    /**
     * Send the transaction to given web socket
     * @param {Object} socket - socket to send the transaction to
     * @param {Object} transaction - transaction to be sent to
     */
    sendTransaction(socket, transaction) {
        socket.send(JSON.stringify({
            type        : MSG_TYPES.transaction,
            transaction
        }));
    }
    /**
     * Broadcast the transaction to every peer in the p2p network
     * @param {Object} transaction - transaction to be broadcasted 
     */
    broadcastTransaction(transaction) {
        this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
    }
    /**
     * Broadcast a transaction to every peer in the p2p network to clear their transaction pools
     */
    broadcastClearTransactions() {
        this.sockets.forEach(socket => socket.send(JSON.stringify({
            type: MSG_TYPES.clear_transactions
        })));
    }
}

module.exports = P2PServer;