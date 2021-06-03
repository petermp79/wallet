const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;  // default port is 5001

const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

class P2PServer {
    constructor(blockChain) {
        this.blockChain = blockChain;   // My block chain
        this.socket = [];               // List of connections with peers
    }

    listen() {
        // Start server and wait for connections
        const server = new Websocket.Server({ port: P2P_PORT });
        server.on('connection', socket => this.connectSocket(socket));

        this.connectToPeers();

        console.log(`Listening for P2P connections pn: ${P2P_PORT}`);
    }

    // Connect to all peers in peer list
    connectToPeers() {
        peers.forEach(peer => {
            const socket = new Websocket(peer);

            this.socket.on('open', () => this.connectSocket());
        });
    }

    // Add a new peer connection to connected peer list
    connectSocket(socket) {
        this.sockets.push(socket);
        console.log('Socket connected');

        this.messageHandler(socket);
        socket.send(JSON.stringify(this.blockChain.chain));
    }

    // Handling messages received from peers
    messageHandler(socket) {
        socket.on('message', message => {
            const data = JSON.parser(message);
            //console.log('message recv: data', data);
            this.blockChain.replaceChain(data);
        })
    }

    // Send my chain as text string
    sendChain(socket) {
        socket.send(JSON.stringify(this.blockChain.chain()));
    }

    // Send my chain to peers
    syncChain() {
        this.sockets.forEach(socket => {
            this.sendChain(socket);
        });
    }
};



module.exports = P2PServer;
