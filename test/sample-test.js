const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

const GOLD = 0;
const SILVER = 1;
const BRONZE = 2;
const THORS_HAMMER = 3;
const SWORD = 4;
const SHIELD = 5;

describe("GameItems Contract", function () {
  let contract;
  let gameItems;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let addrs;

  beforeEach(async function () {
    contract = await ethers.getContractFactory("GameItems");
    [owner, addr1, addr2, addr3, addrs] = await ethers.getSigners();
    // console.log(owner.address);
    gameItems = await contract.deploy();
  });

  describe("Deployment of Contract", function () {
    it("Should assign all tokens to owner on Deployment", async function () {
      expect(await gameItems.balanceOf(owner.address, GOLD)).to.equal(
        ethers.BigNumber.from("1000000000000000000")
      );
      expect(await gameItems.balanceOf(owner.address, THORS_HAMMER)).to.equal(
        10
      );
      expect(await gameItems.balanceOf(owner.address, SHIELD)).to.equal(1000);
    });
  });

  describe("Transfer of Token", function () {
    it("Should transfer tokens from owner to other account", async function () {
      await gameItems.safeTransferFrom(
        owner.address,
        addr1.address,
        GOLD,
        10000,
        "0x00"
      );
      expect(await gameItems.balanceOf(addr1.address, GOLD)).to.equal(10000);
    });

    it("Should not transfer tokens if an account does not contain it", async function () {
      const bronzeBal = await gameItems.balanceOf(addr2.address, BRONZE);
      await expect(
        gameItems.safeTransferFrom(
          addr2.address,
          addr3.address,
          BRONZE,
          10 ** 4,
          "0x00"
        )
      ).to.be.revertedWith("ERC1155: caller is not owner nor approved");

      expect(await gameItems.balanceOf(addr2.address, BRONZE)).to.equal(
        bronzeBal
      );
    });
  });

  describe("Mint Token", function () {
    it("Should allow only owner to mint token", async function () {
      const preGoldBal = await gameItems.balanceOf(owner.address, GOLD);

      await gameItems.mintTokens(GOLD, 10000);
      expect(await gameItems.balanceOf(owner.address, GOLD)).to.equal(
        ethers.BigNumber.from(preGoldBal).add(10000)
      );
    });

    it("Should not allow a non-owner account to mint token", async function () {
      const preSilverBal = await gameItems.balanceOf(addr3.address, BRONZE);

      await expect(
        gameItems.connect(addr3).mintTokens(BRONZE, 100000)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Mint BATCH Token", function () {
    it("Should hould allow only owner to mint BATCH token", async function () {
      const preGoldBal = await gameItems.balanceOf(owner.address, GOLD);

      await gameItems.mintTokens(GOLD, 10000);
      expect(await gameItems.balanceOf(owner.address, GOLD)).to.equal(
        ethers.BigNumber.from(preGoldBal).add(10000)
      );
    });

    it("Should not allow a non-owner account to mint BATCH token", async function () {
      await expect(
        gameItems
          .connect(addr3)
          .mintbatchTokens([GOLD, BRONZE, SHIELD], [10000, 100000, 100])
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Set URI of NFT token", async function () {
    it("Should set URI of token only by owner.", async function () {
      const newURI = "dummy uri";
      await gameItems.setTokenURI(THORS_HAMMER, newURI);

      expect(await gameItems.uri(THORS_HAMMER)).to.equal(newURI);
    });

    it("Should not set empty string as URI of a token.", async function () {
      const newURI = "";
      await expect(
        gameItems.setTokenURI(THORS_HAMMER, newURI)
      ).to.be.revertedWith("Connot set empty string");
    });

    it("Should not set URI if non owner account is trying to do.", async function () {
      const newURI = "dummy uri";
      await expect(
        gameItems.connect(addr1).setTokenURI(THORS_HAMMER, newURI)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Ownership of Contract", function () {
    it("Should remove owner", async function () {
      await gameItems.renounceOwnership();

      expect(await gameItems.owner()).to.equal(
        "0x0000000000000000000000000000000000000000" // zero address
      );
    });

    it("Should transfer ownership to another account", async function () {
      await gameItems.transferOwnership(addr1.address);
      expect(await gameItems.owner()).to.equal(addr1.address);
    });
  });

  describe("Approval of Operator", function () {
    it("Should set operation", async function () {
      await gameItems.setApprovalForAll(addr1.address, true);
      expect(await gameItems.isApprovedForAll(owner.address, addr1.address));
    });
  });

  describe("Safe Transfer BATCH from ", function () {
    it("Should transfer BATCH of tokens from 'from' account to 'to' account.", async function () {
      let preBal = await gameItems.balanceOfBatch(
        [addr2.address, addr2.address, addr2.address],
        [GOLD, SILVER, BRONZE]
      );

      // console.log(preBal);

      await gameItems.safeBatchTransferFrom(
        owner.address,
        addr2.address,
        [GOLD, SILVER, BRONZE],
        [
          ethers.BigNumber.from(1000),
          ethers.BigNumber.from(100),
          ethers.BigNumber.from(10000),
        ],
        "0x00"
      );

      expect(await gameItems.balanceOf(addr2.address, GOLD)).to.equal(
        ethers.BigNumber.from(1000).add(preBal[0]) // preBal[0] = value of gold
      );
      expect(await gameItems.balanceOf(addr2.address, GOLD)).to.equal(
        ethers.BigNumber.from(1000).add(preBal[1]) // preBal[0] = value of silver
      );
      expect(await gameItems.balanceOf(addr2.address, GOLD)).to.equal(
        ethers.BigNumber.from(1000).add(preBal[2]) // preBal[0] = value of bronze
      );
    });

    it("Should not transfer BATCH of tokens if an account does not contain it", async function () {
      const bronzeBal = await gameItems.balanceOf(addr2.address, BRONZE);
      await expect(
        gameItems.safeBatchTransferFrom(
          addr1.address,
          addr2.address,
          [GOLD, SILVER, BRONZE],
          [
            ethers.BigNumber.from(1000),
            ethers.BigNumber.from(100),
            ethers.BigNumber.from(10000),
          ],
          "0x00"
        )
      ).to.be.revertedWith(
        "ERC1155: transfer caller is not owner nor approved"
      );
    });
  });
});
