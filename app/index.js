const express = require('express');
const Blockchain = require('../blockchain');
const bodyParser = require('body-parser');
const P2PServer = require('./p2p-Server');

const HTTP_PORT = process.env.HTTP_PORT || 3001;    // default port 3001

const app = express();
const bc = new Blockchain();
const p2pServer = new P2PServer(bc);

app.use(bodyParser.json());

app.get('/blocks', (req, res) => {
    res.json(bc.chain);
});

app.post('/mine', (req, res) => {
    const block = bc.addBlock(req.body.data);
    console.log(`New block added: ${block.toString()}`);

    // Sync chains with added block
    p2pServer.syncChains();

    res.redirect('/blocks');
});

app.listen(HTTP_PORT, () => console.log(`Listen for HTTP requests on port ${HTTP_PORT} ...`));

p2pServer.listen();




