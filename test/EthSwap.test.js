const { assert } = require('chai')
// const { default: web3 } = require('web3')

const Token = artifacts.require('Token')
const EthSwap = artifacts.require('EthSwap')

require('chai')
  .use(require('chai-as-promised'))
  .should()
  
  function tokens(n) {
    return web3.utils.toWei(n, 'ether')
}
  

contract('EthSwap', ([deployer, investor]) => {

  let token, ethSwap


  before(async () => {
    token = await Token.new()
    ethSwap = await EthSwap.new(token.address)
    await token.transfer(ethSwap.address, tokens('1000000'));
  })

  describe('Token deployment', async () => {
    it('contract has a name', async () => {
      // let token = await Token.new()
      const name = await token.name()
      assert.equal(name, 'DApp Token')
    })
  })


  describe('EthSwap deployment', async () => {
    it('contract has a name', async () => {
      const name = await ethSwap.name()
      assert.equal(name, 'EthSwap Instant Exchange')
    })

    it('contract has tokens', async () => {
    //   let token = await Token.new()
    // let ethSwap = await EthSwap.new()
    let balance = await token.balanceOf(ethSwap.address)
    assert.equal(balance.toString(), tokens('1000000'))
  })
  })

    


  describe('buyTokens()', async () => {
    let result;

    before(async () => {
    result = await ethSwap.buyTokens({from: investor, value: web3.utils.toWei('1', 'ether')})
    })
    
    it('Allows user to instantly purchase tokens from ethSwap for a fixed price', async () => {
      // Checking buyer balance for tokens went up or not
      let investorBalance = await token.balanceOf(investor)
      assert.equal(investorBalance.toString(), tokens('100'))

      // Checking ethSwap balance
      let ethSwapBalance
      // Token Balance went down 
      ethSwapBalance = await token.balanceOf(ethSwap.address)
      assert.equal(ethSwapBalance.toString(), tokens('999900'))

      // Getting ether balance went up
      ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
      assert.equal(ethSwapBalance.toString(), web3.utils.toWei('1', 'ether'))

      // console.log(result.logs[0].args);
      // Running tests via events as well 
      const event = result.logs[0].args
      assert.equal(event.account, investor)
      assert.equal(event.token, token.address)
      assert.equal(event.amount.toString(), tokens('100').toString())
      assert.equal(event.rate.toString(), '100')
    })


    describe('sellTokens()', async () => {
    let result

    before(async () => {
      // Investor must approve tokens before the purchase
      await token.approve(ethSwap.address, tokens('100'), { from: investor })
      // Investor sells tokens
      result = await ethSwap.sellTokens(tokens('100'), { from: investor })
    })

    it('Allows user to instantly sell tokens to ethSwap for a fixed price', async () => {
      // Check investor token balance after purchase
      let investorBalance = await token.balanceOf(investor)
      assert.equal(investorBalance.toString(), tokens('0'))

      // Check ethSwap balance after purchase
      let ethSwapBalance
      ethSwapBalance = await token.balanceOf(ethSwap.address)
      assert.equal(ethSwapBalance.toString(), tokens('1000000'))
      ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
      assert.equal(ethSwapBalance.toString(), web3.utils.toWei('0', 'Ether'))

      // Check logs to ensure event was emitted with correct data
      const event = result.logs[0].args
      assert.equal(event.account, investor)
      assert.equal(event.token, token.address)
      assert.equal(event.amount.toString(), tokens('100').toString())
      assert.equal(event.rate.toString(), '100')

      // FAILURE: investor can't sell more tokens than they have
      await ethSwap.sellTokens(tokens('500'), { from: investor }).should.be.rejected;
    })
  })
  })


  
})