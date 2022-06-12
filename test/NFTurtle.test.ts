// #region Imports
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';
// #endregion

describe.only('NFTurtle test', () => {
    // #region Declarations.

    let nfTurtleInstance: Contract;
    let owner: SignerWithAddress;
    let otherAccount: SignerWithAddress;

    // metadata cID for the NFT id #1
    const metadataCid0 = 'QmPPZoLvfsDNt93jyke34n4HNAMXK3wd8oYH7TyG9rNxia';
    const baseURI = 'http://ipfs.dappnode/ipfs/';

    // #endregion

    // #region Hooks.

    // Runs once before the first test in this block.
    before(async function () {
        [owner, otherAccount] = await ethers.getSigners();

        const NFTurtle = await ethers.getContractFactory('NFTurtle');
        const NFTurtleInstance = await NFTurtle.deploy();
        nfTurtleInstance = await NFTurtleInstance.deployed();

        const nftAddress = nfTurtleInstance.address;

        console.log('\tNFTs address:', nftAddress);
        console.log('\towner address:', owner.address);
        console.log('\totherAccount address:', otherAccount.address);
    });

    // #endregion

    // #region Tests

    it('the nft collection must be initialized', async function () {
        // Arrange.

        // ipfs client not working currently inside hardhat tests
        // const cid = await ipfs.hashCID('Hello world');
        // console.log('cid', cid.toString());

        // Act.
        const tokenName = (await nfTurtleInstance.name()) as string;
        const tokenSymbol = (await nfTurtleInstance.symbol()) as string;
        const tokenBaseURI = (await nfTurtleInstance.baseURI()) as string;

        console.log('\tNFT data:', tokenName, tokenSymbol, tokenBaseURI);
        console.log();

        // Assert.
        expect(tokenName).to.be.equal('NFTurtle TEST1');
        expect(tokenSymbol).to.be.equal('NFTurtleT1');
        return expect(tokenBaseURI).to.be.equal('');
    });

    it('the nft will be fully initialized', async () => {
        // after deployment

        // set minting price
        const mintingPrice = ethers.utils.parseEther('.1');
        console.log('\tmintingPrice:', ethers.utils.formatEther(mintingPrice), 'ether');
        await nfTurtleInstance.setMintPrice(mintingPrice);

        // set base uri
        const baseURI = 'http://ipfs.dappnode/ipfs/';
        await nfTurtleInstance.setBaseURI(baseURI);

        // set metadata
        await nfTurtleInstance.issueNFTurtle(metadataCid0);

        // initialize mint sale
        await nfTurtleInstance.flipSaleState();

        const buyer = otherAccount;

        // Eth Balance
        const ETHBalanceBefore = await ethers.provider.getBalance(buyer.address);
        // NFT Balance
        const NFTBalanceBefore = await nfTurtleInstance.balanceOf(buyer.address);

        // test: buyer should pay .1 ether to buy a nft
        // Mint
        await nfTurtleInstance.connect(buyer).mintNFTurtle({ value: mintingPrice });

        // const ETHBalanceAfter = await ethers.provider.getBalance(buyer.address);
        // const expectedETHBalance = ETHBalanceBefore.sub(mintingPrice);
        // const NFTBalanceAfter = await nfTurtleInstance.balanceOf(buyer.address);

        // // Assert.
        // expect(NFTBalanceBefore.toString()).to.equal('0');
        // expect(NFTBalanceAfter.toString()).to.equal('1');
        // expect(ETHBalanceAfter).to.equal(expectedETHBalance);
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
        await expect(nfTurtleInstance.tokenURI(tokenId)).to.be.revertedWith(
            'ERC721Metadata: URI query for nonexistent token'
        );
    });

    // it('when minting with an existing cid it should be reverted', async function () {
    //     // Arrange.

    //     // Act.

    //     // Assert.
    //     await expect(nfTurtleInstance.mint(owner, [metadataCid0])).to.be.revertedWith('IPFS hash already used');
    // });

    // it("after minting the tokenIds should be in the owner's list of tokens", async function () {
    //     // Arrange.

    //     // Act.
    //     const tokenIds = await nfTurtleInstance.walletOfOwner(owner);

    //     // Assert.
    //     expect(tokenIds.length).to.equal(1);
    //     return expect(tokenIds[0].toString()).to.equal('0');
    // });

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
