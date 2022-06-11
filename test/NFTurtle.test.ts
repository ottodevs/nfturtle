// #region Imports
import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';
// #endregion

describe('NFTurtle test', () => {
    // #region Declarations.

    let nfTurtleInstance: Contract;
    let owner: string;
    let otherAccount: string;
    const metadataCid0 = 'QmPUT5nrbfKJnSQjuudwom5Z3wdyv8u4Kiv7Xrt3jVazMu';
    const baseURI = 'https://ipfs.io/ipfs/';

    // #endregion

    // #region Hooks.

    // Runs once before the first test in this block.
    before(async function () {
        [owner, otherAccount] = (await ethers.getSigners()).map((signer) => signer.address);

        const NFTurtle = await ethers.getContractFactory('NFTurtle');
        const NFTurtleInstance = await NFTurtle.deploy('Sea Turtles', 'ST');
        nfTurtleInstance = await NFTurtleInstance.deployed();

        const nftAddress = nfTurtleInstance.address;

        console.log('\tNFTs address:', nftAddress);
        console.log('\towner address:', owner);
        console.log('\totherAccount address:', otherAccount);
    });

    // #endregion

    // #region Tests

    it('the nft collection must be initialized', async function () {
        // Arrange.

        // Act.
        const tokenName = (await nfTurtleInstance.name()) as string;
        const tokenSymbol = (await nfTurtleInstance.symbol()) as string;
        const tokenBaseURI = (await nfTurtleInstance.baseURI()) as string;

        console.log('\tNFT data:', tokenName, tokenSymbol, tokenBaseURI);
        console.log();

        // Assert.
        expect(tokenName).to.be.equal('Sea Turtles');
        expect(tokenSymbol).to.be.equal('ST');
        return expect(tokenBaseURI).to.be.equal(baseURI);
    });

    it('when minting an nft the balance of the new owner must be increased', async function () {
        // Arrange.

        // Act.
        const previowsBalance = await nfTurtleInstance.balanceOf(owner);
        await nfTurtleInstance.mint(owner, [metadataCid0]);
        const actualBalance = await nfTurtleInstance.balanceOf(owner);

        // Assert.
        expect(previowsBalance.toString()).to.equal('0');
        expect(actualBalance.toString()).to.equal('1');
    });

    it('the tokenURI must be made up of the baseURI plus the IPFS hash of the metadata file', async function () {
        // Arrange.
        const tokenId = 0;
        const expectedTokenURI = `${baseURI}${metadataCid0}`;

        // Act.
        const tokenURI = await nfTurtleInstance.tokenURI(tokenId);

        // Assert.
        return expect(tokenURI).to.be.equal(expectedTokenURI);
    });

    it('when trying to get a tokenURI from an unminted nft you should revert', async () => {
        // Arrange.
        const tokenId = 1000;

        // Act.

        // Assert.
        await expect(nfTurtleInstance.tokenURI(tokenId)).to.be.revertedWith('TokenId not found');
    });

    it('when minting with an existing cid it should be reverted', async function () {
        // Arrange.

        // Act.

        // Assert.
        await expect(nfTurtleInstance.mint(owner, [metadataCid0])).to.be.revertedWith('IPFS hash already used');
    });

    it("after minting the tokenIds should be in the owner's list of tokens", async function () {
        // Arrange.

        // Act.
        const tokenIds = await nfTurtleInstance.walletOfOwner(owner);

        // Assert.
        expect(tokenIds.length).to.equal(1);
        return expect(tokenIds[0].toString()).to.equal('0');
    });

    it('should be able to change the baseURI', async function () {
        // Arrange.
        const newBaseURI = 'https://gateway.pinata.cloud/ipfs/';

        // Act.
        await nfTurtleInstance.setBaseURI(newBaseURI);
        const updatedBaseURI = await nfTurtleInstance.baseURI();

        // Assert.
        expect(updatedBaseURI).to.be.equal(newBaseURI);
    });
    // #endregion
});
