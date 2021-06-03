const Block = require('./block');

class Blockchain {
    constructor() {
        // Init this block chain
        this.chain = [Block.genesis()];
    }

    // Add a new block to this block chain
    addBlock(data) {
        const lastBlock = this.chain[this.chain.length-1];
        const block = Block.mineBlock(lastBlock, data);
        this.chain.push(block);

        return block;
    }

    // Validate an incoming chain
    isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
            return false;

        // Validate hash value of blocks in the chain
        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const lastBlock = chain[i-1];

            if (block.lastHash != lastBlock.hash ||
                block.hash !== Block.blockHash(block)) {
                    return false;
                }
        }
        return true;
    }

    replaceChain(newChain) {
        if (newChain.length <= this.chain.length) {
            console.log('replaceChain: new chain is shorter than current chain.');
            return;
        } else if (!this.isValidChain(newChain)) {
            console.log('replaceChain: new chain is in valid.');
        }
        console.log("Current block chain is replaced.");

        this.chain = newChain;
    }
}

module.exports = Blockchain;