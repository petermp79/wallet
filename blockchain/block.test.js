
const { it, expect } = require('@jest/globals');
const Block = require('./block');
const { DIFFICULTY } = require('../config');

describe('Block', () => {
    let data, lastBlock, block;

    beforeEach(() => {
        data = 'bar';
        lastBlock = Block.genesis();
        block = Block.mineBlock(lastBlock, data);
    });

    it('set the `data` to match the input', () => {
        expect(block.data).toEqual(data);
    });

    it('set the `lastHash` to match the hash of the last block', () => {
        expect(block.lastHash).toEqual(lastBlock.hash);
    });

    it('generate a hash that matches the difficulty', () => {
        expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty));
        console.log(block.toString());
    });

    it('lower the difficulty for slowly mined block', () => {
        expect(Block.adjustDifficulty(block, block.timestamp+360000))
            .toEqual(block.difficulty-1);
    });

    it('raise the difficulty for quickly mined bloxk', () => {
        expect(Block.adjustDifficulty(block, block.timestamp+1))
            .toEqual(block.difficulty+1);
    })
});