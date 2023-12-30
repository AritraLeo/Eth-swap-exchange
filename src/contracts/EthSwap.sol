pragma solidity ^0.5.0;

import './Token.sol';

contract EthSwap {
    string public name = "EthSwap Instant Exchange";
    Token public token;
    uint public rate = 100;

    event TokenPurchased(
        address account, 
        address token,
        uint amount,
        uint rate 
    );

    event TokenSold(
        address account, 
        address token,
        uint amount,
        uint rate 
    );

    constructor(Token _token) public{
        token = _token;
    }

    function buyTokens() public payable{
        uint tokenAmount = msg.value * rate;

        // Check if exchange has enough balance - 
        require(token.balanceOf(address(this)) >= tokenAmount);

        token.transfer(msg.sender, tokenAmount);

        // Emit an event
        emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    function sellTokens(uint _amount) public payable {
        // User can't sell more tokens than he has -
        require(token.balanceOf(msg.sender) >= _amount);

        // Calculate ether amount
        uint etherAmount = _amount / rate;

        // Check if contract has enough ether - lolx
        require(address(this).balance >= etherAmount);

        // Transfer tokens to ethSwap now:
        token.transferFrom(msg.sender, address(this), _amount);

        // Transfer Ether to investor
        msg.sender.transfer(etherAmount);

        // Emit event
        emit TokenSold(msg.sender, address(token), _amount, rate);
    }
}
