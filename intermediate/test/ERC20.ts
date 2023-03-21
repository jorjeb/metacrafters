import { expect } from 'chai'
import { ethers } from 'hardhat'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

describe('ERC20 contract testing', function () {
  const totalSupply = 1000

  let erc20: any
  let owner: SignerWithAddress
  let addr1: SignerWithAddress
  let addr2: SignerWithAddress

  before(async function () {
    ;[owner, addr1, addr2] = await ethers.getSigners()
    const ERC20 = await ethers.getContractFactory('ERC20')
    erc20 = await ERC20.deploy()
    erc20.connect(owner).mint(totalSupply)
  })

  it('Should assign the total supply of tokens to msg.sender', async function () {
    const ownerBalance = await erc20.balanceOf(owner.address)
    expect(await erc20.totalSupply()).to.equal(ownerBalance)

    // Owner balance should be 1000 tokens
    expect(ownerBalance).to.equal(totalSupply)
  })

  it('Should transfer tokens between accounts', async function () {
    // Transfer 100 tokens from owner to addr1
    await erc20.transfer(addr1.address, 100)
    expect(await erc20.balanceOf(addr1.address)).to.equal(100)

    // Transfer 50 tokens from addr1 to addr2
    // We use .connect(signer) to send a transaction from another account
    await erc20.connect(addr1).transfer(addr2.address, 50)
    expect(await erc20.balanceOf(addr2.address)).to.equal(50)

    // Check that addr1 has 50 tokens left
    expect(await erc20.balanceOf(addr1.address)).to.equal(50)
  })

  it('Should fail if sender doesn’t have enough tokens', async function () {
    const initialOwnerBalance = await erc20.balanceOf(owner.address)

    // Try to send 51 token from addr1 (50 tokens) to owner (1000 tokens).
    // `require` will evaluate false and revert the transaction.
    await expect(erc20.connect(addr1).transfer(owner.address, 51)).to.be.reverted

    // Owner balance shouldn't have changed.
    expect(await erc20.balanceOf(owner.address)).to.equal(initialOwnerBalance)
  })

  it('Should update balances after transfers', async function () {
    const initialOwnerBalance = await erc20.balanceOf(owner.address)

    // Transfer 100 tokens from owner to addr1.
    await erc20.transfer(addr1.address, 100)

    // Transfer another 50 tokens from owner to addr2.
    await erc20.transfer(addr2.address, 50)

    // Check balances.
    const finalOwnerBalance = await erc20.balanceOf(owner.address)
    expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150))

    const addr1Balance = await erc20.balanceOf(addr1.address)
    expect(addr1Balance).to.equal(150)

    const addr2Balance = await erc20.balanceOf(addr2.address)
    expect(addr2Balance).to.equal(100)
  })
})
