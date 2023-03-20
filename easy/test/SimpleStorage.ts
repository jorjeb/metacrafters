import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('SimpleStorage contract testing', function () {
  let simpleStorage: any

  before('Deploy SimpleStorage contract', async () => {
    const SimpleStorage = await ethers.getContractFactory('SimpleStorage')
    simpleStorage = await SimpleStorage.deploy()
  })

  it('Should be able to change the state variable x', async function () {
    simpleStorage.set(123)
    expect(await simpleStorage.get()).to.equal(123)

    simpleStorage.set(456)
    expect(await simpleStorage.get()).to.equal(456)
  })
})
